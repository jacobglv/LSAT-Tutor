from django.db import models
from django.contrib.auth.models import User
from datetime import date

# Create a new session and categorize by date
class Session(models.Model):
    TYPES = [
        ("S", "Shuffle"),
        ("RC", "Reading Comprehension"),
        ("LR", "Logical Reasoning")
    ]
    
    date = models.DateField(default=date.today)
    goal = models.CharField(max_length=100)
    reflection = models.CharField(max_length=100)
    self_evaluation = models.IntegerField(default=None)
    score = models.IntegerField(default=None)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sessions")
    type = models.CharField(max_length=2, choices=TYPES, default="LR")
