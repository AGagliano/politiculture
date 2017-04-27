
#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif

#define PIN 6
#define NUMPIXELS 6

Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);
int delayval = 500; // delay for half a second
//
//const int ledPin = 13; // the pin that the LED is attached to
int incomingByte;      // a variable to read incoming serial data into

void setup() {
  pixels.begin();
  // initialize serial communication:
  Serial.begin(9600);
  pixels.setPixelColor(0, pixels.Color(0,0,0));
  pixels.show();
}

void loop() {
  // see if there's incoming serial data:
  if (Serial.available() > 0) {
    // read the oldest byte in the serial buffer:
    incomingByte = Serial.read();
    // if it's a capital H (ASCII 72), turn on the LED:
    if (incomingByte == 'H') {
      pixels.setPixelColor(0, pixels.Color(0,150,0));
      pixels.show();
    }
    // if it's an L (ASCII 76) turn off the LED:
    if (incomingByte == 'L') {
//      digitalWrite(ledPin, LOW);
      pixels.setPixelColor(0, pixels.Color(0,0,0));
      pixels.show();
        Serial.println("nope");
    }
  }
}

