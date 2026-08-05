package com.mumsif.orchid

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.lifecycleScope
import com.google.firebase.auth.FirebaseAuth
import core.data.local.datastore.UserPreferences
import com.mumsif.orchid.ui.navigation.OrchidNavGraph
import core.ui.theme.OrchidTheme
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    @Inject
    lateinit var userPreferences: UserPreferences

    @Inject
    lateinit var firebaseAuth: FirebaseAuth

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        var startDestination by mutableStateOf<String?>(null)

        lifecycleScope.launch {
            try {
                val hasOnboarded = userPreferences.hasOnboarded.first()
                val currentUser = try { firebaseAuth.currentUser } catch (e: Throwable) { null }

                startDestination = when {
                    !hasOnboarded -> "onboarding"
                    currentUser != null -> "home"
                    else -> "signin"
                }
            } catch (e: Throwable) {
                e.printStackTrace()
                startDestination = "onboarding"
            }
        }

        setContent {
            OrchidTheme {
                startDestination?.let { destination ->
                    OrchidNavGraph(startDestination = destination)
                }
            }
        }
    }
}

