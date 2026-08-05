import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { processGemini } from "./providers/gemini";
import { processGroq } from "./providers/groq";
import { processMistral } from "./providers/mistral";

// Initialize the Firebase Admin SDK to interact with Firestore, Auth, etc.
admin.initializeApp();

/**
 * handleAIRequest is an HTTPS request trigger (endpoint) that parses natural language command strings.
 * It is called by the Android client using the Ktor HttpClient.
 */
export const handleAIRequest = functions.https.onRequest(async (req, res) => {
    // Enable CORS to allow requests from different origins (e.g., local emulators or client tests)
    res.set("Access-Control-Allow-Origin", "*");
    
    // Handle the preflight OPTIONS request from HTTP clients (CORS shakehands)
    if (req.method === "OPTIONS") {
        res.set("Access-Control-Allow-Methods", "POST");
        res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.status(204).send("");
        return;
    }

    try {
        // 1. Verify Authentication
        // Extract the Authorization header (should be "Bearer <Firebase-JWT-ID-Token>")
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).send({ error: "Unauthorized: Missing or invalid token" });
            return;
        }

        const idToken = authHeader.split("Bearer ")[1];
        let decodedToken;
        try {
            // Verify the ID token using the Firebase Admin Auth SDK.
            // If valid, this decrypts the token and returns the user's details.
            decodedToken = await admin.auth().verifyIdToken(idToken);
        } catch (authError) {
            res.status(401).send({ error: "Unauthorized: Token verification failed" });
            return;
        }

        const uid = decodedToken.uid; // Retrieve the verified user ID from the token

        // 2. Parse Request Body
        // The Ktor client sends a JSON payload mapping to ParseRequest (command & optional providerHint)
        const { command, providerHint } = req.body;
        if (!command) {
            res.status(400).send({ error: "Bad Request: Missing command string" });
            return;
        }

        // 3. Increment Quota / Log Usage in Firestore
        // We use a transaction to safely fetch and increment the quota counter.
        const userRef = admin.firestore().collection("users").doc(uid);
        await admin.firestore().runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            let quotaCount = 0;
            if (userDoc.exists) {
                quotaCount = userDoc.data()?.quotaCount || 0;
            }
            // If user has reached their daily limit (100 calls), throw an error to fail transaction
            if (quotaCount >= 100) {
                throw new Error("Quota exceeded: limit is 100 queries per day");
            }
            // Increment the counter in Firestore
            transaction.set(userRef, { quotaCount: quotaCount + 1 }, { merge: true });
        });

        // 4. Live AI Parsing Logic
        let parsedResult;
        const hint = (providerHint || "gemini").toLowerCase();

        try {
            if (hint === "groq") {
                parsedResult = await processGroq(command);
            } else if (hint === "mistral") {
                parsedResult = await processMistral(command);
            } else {
                parsedResult = await processGemini(command);
            }
        } catch (apiError: any) {
            console.error(`AI provider '${hint}' query failed:`, apiError);
            res.status(502).send({ error: `Bad Gateway: ${apiError.message || "Upstream AI provider error"}` });
            return;
        }

        // Return the structured command object back to Ktor client as JSON
        res.status(200).send({
            action: parsedResult.action || "unknown",
            target: parsedResult.target || "unknown",
            filter: parsedResult.filter || {},
            confidence: parsedResult.confidence || 0.95
        });

    } catch (error: any) {
        console.error("AI Request processing failed:", error);
        res.status(500).send({ error: error.message || "Internal Server Error" });
    }
});
