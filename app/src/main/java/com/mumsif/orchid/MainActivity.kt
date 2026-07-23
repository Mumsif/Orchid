package com.mumsif.orchid

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.mumsif.orchid.ui.theme.OrchidTheme
import feature.onboarding.ui.OnboardingScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            OrchidTheme {
                OnboardingScreen(
                    onGetStarted = {
                        //Function Kudukkanum
                    },
                    onSignIn = {
                        //Function Kudukkanum
                    }
                )
            }
        }
    }
}
