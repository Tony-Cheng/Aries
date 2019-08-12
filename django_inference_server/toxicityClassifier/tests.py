from django.test import TestCase
from toxicityClassifier.apps import ToxicityCheck

# Create your tests here.

class ToxicityCheckTest(TestCase):
    def setUp(self):
        self.checker = ToxicityCheck()

    def test_animals_can_speak(self):
        """Animals that can speak are correctly identified"""
        text1 = "Hello"
        text2 = "fuck you"
        self.assertEqual(self.checker.isToxic(text1), False)
        self.assertEqual(self.checker.isToxic(text2), True)