package com.mumsif.orchid.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

// Orchid is a dark-first product — the prototype has no light variant.
// This scheme is used whenever dynamicColor is off (the default).
private val OrchidDarkColorScheme = darkColorScheme(
    primary = OrchidPurple,
    onPrimary = Color.White,
    secondary = OrchidCyan,
    onSecondary = OrchidBackground,
    tertiary = OrchidCyan,
    background = OrchidBackground,
    onBackground = OrchidTextPrimary,
    surface = OrchidSurface,
    onSurface = OrchidTextPrimary,
    surfaceVariant = OrchidSurface2,
    onSurfaceVariant = OrchidTextDim,
    outline = OrchidBorder,
    error = OrchidError,
    onError = Color.White
)

// Kept only in case a future light mode is designed. Not used by default.
private val OrchidLightColorScheme = lightColorScheme(
    primary = OrchidPurple,
    secondary = OrchidCyan,
    tertiary = OrchidCyan
)

@Composable
fun OrchidTheme(
    darkTheme: Boolean = true, // Orchid is dark-only for now; ignore system setting
    // Off by default: Material You would otherwise override the brand
    // palette with colors pulled from the user's wallpaper on Android 12+.
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> OrchidDarkColorScheme
        else -> OrchidLightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}