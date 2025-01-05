from django.urls import path
from . import views

urlpatterns = [
    path("scrape/", views.ScrapeWebsiteView.as_view(), name="scrape_website"),
    path("parse/", views.ParseContentView.as_view(), name="parse_content"),
    path("retreive_notes/", views.RetreiveNotes.as_view(), name="retreive_notes"),
    path("get_dom_content/", views.GetDomContent.as_view(), name="get_dom_content")
]