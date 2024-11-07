from django.db import models

# Create your models here.

class Note(models.Model):
    user_id = models.CharField(max_length=255)
    url = models.CharField(max_length=255)
    prompt = models.CharField(max_length=2550, null=True)
    result = models.CharField(max_length=80000, null=True)
    is_dom_content = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.url
