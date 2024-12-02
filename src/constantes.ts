export const configuracionOled = `/**
Placa: ESP32 Dev Module

Conexiones:
OLED   ESP32
GND -> GND
VCC -> 3.3V
D0  -> D18
D1  -> D23
RES -> D2
DC  -> D4
CS  -> D5
*/
#include <Arduino.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define PANTALLA_ANCHO 128
#define PANTALLA_ALTO 64

#define OLED_MOSI   23
#define OLED_CLK    18
#define OLED_DC     4
#define OLED_CS     5
#define OLED_RESET  2

Adafruit_SSD1306 pantalla(PANTALLA_ANCHO, PANTALLA_ALTO,
  OLED_MOSI, OLED_CLK, OLED_DC, OLED_RESET, OLED_CS);
`;

export const configuracion = `void setup() {
  Serial.begin(115200);

  if(!pantalla.begin(SSD1306_SWITCHCAPVCC)) {
    Serial.println(F("SSD1306 No se pudo inicializar"));
    for(;;);
  }
  
  pantalla.clearDisplay();
  pantalla.display();
  delay(1000);

  pantalla.clearDisplay();
  pantalla.drawBitmap(0, 0, imagen, PANTALLA_ANCHO, PANTALLA_ALTO, SSD1306_WHITE);
  pantalla.display();
  delay(1000);
}`;
