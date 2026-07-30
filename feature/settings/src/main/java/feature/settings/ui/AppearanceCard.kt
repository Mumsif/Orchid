package feature.settings.ui

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowRight
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import feature.settings.R

private val DarkModeBoxColor = Color(0xFF2A1F4D)
private val AIBtnColor = Color(0xFF7C3AED)
private val EqualizerColor = Color(0xFF1BBFDB)
private val EqualizerBoxColor = Color(0xFF1B3045)
@Composable
fun Appearance(){
    Box(
        modifier = Modifier.width(350.dp)
            .height(162.dp)
            .background(
                color = Color(0xFF1A1A2E),
                shape = RoundedCornerShape(20.dp)
            )
            .border(
                width = 1.dp,
                color = Color(0xFF2A2A4A),
                shape = RoundedCornerShape(20.dp)
            )
    ) {
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceEvenly
        ){
            Row(
                modifier = Modifier.fillMaxWidth()
                    .height(67.dp)
                    .padding(horizontal = 10.dp)
                    .clickable(onClick = {}),
                horizontalArrangement = Arrangement.Start,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier.size(42.dp)
                        .background(
                            color = DarkModeBoxColor,
                            shape = RoundedCornerShape(15.dp)
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        painter = painterResource(id = R.drawable.night),
                        contentDescription = "Night Logo",
                        modifier = Modifier.size(24.dp),
                        tint = Color(0xFFA78BFA)
                    )
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column (
                    verticalArrangement = Arrangement.SpaceEvenly
                ){
                    Text(
                        text = "Dark mode",
                        color = Color.White,
                        style = TextStyle(
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    )
                    Spacer(modifier = Modifier.height(7.dp))
                    Text(
                        text = "OLED-friendly deep slate theme",
                        color = Color(0xFF5A5A78),
                        style = TextStyle(
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Normal
                        )
                    )
                }
                Spacer(modifier = Modifier.width(38.dp))
                Switch(
                    checked = true,
                    onCheckedChange = {},
                    modifier = Modifier.padding(start = 10.dp),
                    colors = SwitchDefaults.colors(
                        checkedThumbColor = Color.White,
                        uncheckedThumbColor = Color.Gray,
                        checkedTrackColor = AIBtnColor.copy(alpha = 0.5f),
                        uncheckedTrackColor = Color.Gray.copy(alpha = 0.5f)
                    )
                )
            }
            Spacer(modifier = Modifier.height(10.dp))
            HorizontalDivider()
            Spacer(modifier = Modifier.height(10.dp))
            Row(
                modifier = Modifier.fillMaxWidth()
                    .height(67.dp)
                    .padding(horizontal = 10.dp)
                    .clickable(onClick = {}),
                horizontalArrangement = Arrangement.Start,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier.size(42.dp)
                        .background(
                            color = EqualizerBoxColor,
                            shape = RoundedCornerShape(15.dp)
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        painter = painterResource(id = R.drawable.equalizer),
                        contentDescription = "Night Logo",
                        modifier = Modifier.size(24.dp),
                        tint = EqualizerColor
                    )
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column (
                    verticalArrangement = Arrangement.SpaceEvenly
                ){
                    Text(
                        text = "Haptic feedback",
                        color = Color.White,
                        style = TextStyle(
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    )
                    Spacer(modifier = Modifier.height(7.dp))
                    Text(
                        text = "Gentle pulse when a command \ncompletes",
                        color = Color(0xFF5A5A78),
                        style = TextStyle(
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Normal
                        )
                    )
                }
                Spacer(modifier = Modifier.width(38.dp))
                Switch(
                    checked = true,
                    onCheckedChange = {},
                    modifier = Modifier.padding(start = 10.dp),
                    colors = SwitchDefaults.colors(
                        checkedThumbColor = Color.White,
                        uncheckedThumbColor = Color.Gray,
                        checkedTrackColor = AIBtnColor.copy(alpha = 0.5f),
                        uncheckedTrackColor = Color.Gray.copy(alpha = 0.5f)
                    )
                )
            }
        }
    }
}

@Preview(showBackground = true, widthDp = 360, heightDp = 800, backgroundColor = 0xFF0E0E1D)
@Composable
private fun ProviderRotationCardPreview() {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Appearance()
    }
}