from django.urls import path
from . import views

urlpatterns = [
    path("scrape/", views.ScrapeWebsiteView.as_view(), name="scrape_website"),
    path("parse/", views.ParseContentView.as_view(), name="parse_content"),
]