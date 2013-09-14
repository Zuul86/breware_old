import threading
import time
import RPi.GPIO as GPIO

class ToggleGlowbar(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
    def run(self):
        GPIO.output(22, True) # glow bar
        time.sleep(10)
        GPIO.output(23, True)
        time.sleep(2)
        GPIO.output(22, False)       