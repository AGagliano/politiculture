
#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif

#define PIN 6
#define NUMPIXELS 10

Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);
int delayval = 500; // delay for half a second
//
//const int ledPin = 13; // the pin that the LED is attached to
int incomingByte;      // a variable to read incoming Serial1 data into

void setup() {
  pixels.begin();
  // initialize Serial1 communication:
  Serial1.begin(9600);
  for (int i = 0; i < NUMPIXELS; i++) {
    pixels.setPixelColor(i, pixels.Color(0,0,0));
  }

  pixels.show();
}

void loop() {

  // see if there's incoming Serial1 data:
  if (Serial1.available() > 0)
    incomingByte = Serial1.read();

    if (incomingByte == '0') {

        for (int i = 0; i < NUMPIXELS; i++) {
          pixels.setPixelColor(i, pixels.Color(0,0,0));
        }
        pixels.show();
        Serial1.println("None");
    }

    if (incomingByte == 'A') {
        for (int i = 0; i < NUMPIXELS; i++) {
          pixels.setPixelColor(i, pixels.Color(255,0,0));
        }
        pixels.show();
        Serial1.println("Red");
    }
    // if it's an L (ASCII 76) turn off the LED:
    if (incomingByte == 'S') {

        for (int i = 0; i < NUMPIXELS; i++) {
          pixels.setPixelColor(i, pixels.Color(0,0,255));
        }

      pixels.show();
      Serial1.println("BLUE");
    }

    if (incomingByte == 'D') {
        for (int i = 0; i < NUMPIXELS; i++) {
            pixels.setPixelColor(i, pixels.Color(128,0,128));

         }
      pixels.show();
      Serial1.println("PURPLE");
    }
  }

