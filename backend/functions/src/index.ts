import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

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

        // 4. AI Parsing Logic (Stubbed/Mocked)
        // Structures the raw speech query into an action, target, and extra filter map.
        let action = "unknown";
        let target = "unknown";
        const filter: { [key: string]: string } = {};

        const lowerCmd = command.toLowerCase();
        
        // Flashlight parsing rules
        if (lowerCmd.includes("flashlight") || lowerCmd.includes("torch")) {
            target = "flashlight";
            action = lowerCmd.includes("off") ? "disable" : "enable";
        
        // Wi-Fi parsing rules
        } else if (lowerCmd.includes("wifi")) {
            target = "wifi";
            action = lowerCmd.includes("off") ? "disable" : "enable";
        
        // Bluetooth parsing rules
        } else if (lowerCmd.includes("bluetooth")) {
            target = "bluetooth";
            action = lowerCmd.includes("off") ? "disable" : "enable";
        
        // Music command rules (e.g. "play Starboy")
        } else if (lowerCmd.includes("music") || lowerCmd.includes("song") || lowerCmd.includes("play")) {
            target = "music";
            action = "play";
            if (lowerCmd.includes("play ")) {
                filter["query"] = command.substring(lowerCmd.indexOf("play ") + 5);
            }
        
        // Alarm command rules (e.g. "set alarm at 7:30")
        } else if (lowerCmd.includes("alarm")) {
            target = "alarm";
            action = "create";
            const timeMatch = command.match(/\d+:\d+|\d+/);
            if (timeMatch) {
                filter["time"] = timeMatch[0];
            } else {
                filter["time"] = "08:00";
            }
        
        // Phone/Contact command rules (e.g. "call Mom")
        } else if (lowerCmd.includes("call") || lowerCmd.includes("phone")) {
            target = "contact";
            action = "call";
            if (lowerCmd.includes("call ")) {
                filter["name"] = command.substring(lowerCmd.indexOf("call ") + 5);
            }
        
        // Note command rules (e.g. "take note remember keys")
        } else if (lowerCmd.includes("note")) {
            target = "note";
            action = "create";
            if (lowerCmd.includes("note ")) {
                filter["content"] = command.substring(lowerCmd.indexOf("note ") + 5);
            } else {
                filter["content"] = command;
            }
        
        // Gallery command rules
        } else if (lowerCmd.includes("photo") || lowerCmd.includes("gallery") || lowerCmd.includes("image")) {
            target = "gallery";
            action = "open";
        
        // Files command rules
        } else if (lowerCmd.includes("file") || lowerCmd.includes("explorer")) {
            target = "file";
            action = "open";
        
        // Calendar command rules (e.g. "schedule Birthday")
        } else if (lowerCmd.includes("calendar") || lowerCmd.includes("event")) {
            target = "calendar";
            action = "create";
            if (lowerCmd.includes("schedule ")) {
                filter["title"] = command.substring(lowerCmd.indexOf("schedule ") + 9);
            } else {
                filter["title"] = "New Event";
            }
        }

        // Return the structured command object back to Ktor client as JSON
        res.status(200).send({
            action,
            target,
            filter,
            confidence: 0.95
        });

    } catch (error: any) {
        console.error("AI Request processing failed:", error);
        res.status(500).send({ error: error.message || "Internal Server Error" });
    }
});
