from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Note
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .scrape import scrape_website, extract_body_content, clean_body_content
from .parse import parse_with_ollama


# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class ScrapeWebsiteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        website_url = request.data.get("url")
        if not website_url:
            return Response({"error": "URL is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            queryset = Note.objects.filter(url=website_url, is_dom_content=True)
     
            if queryset.exists():
                dom_content_cleaned = queryset[0].result
            else:
                html_content = scrape_website(website_url)
                dom_body_content = extract_body_content(html_content)
                dom_content_cleaned = clean_body_content(dom_body_content)
      
                note = Note(user_id = request.user.id, url = website_url, result = dom_content_cleaned, is_dom_content = True)
                note.save()

            return Response({"dom_content_cleaned": dom_content_cleaned}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class ParseContentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        dom_content = request.data.get("dom_content")
        parse_description = request.data.get("parse_description")
        website_url = request.data.get("url")
        print(website_url)
        user_id = request.user.id
        if not dom_content:
            return Response({"error": "DOM content is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not parse_description:
            return Response({"error": "Parse description is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            parsed_result = parse_with_ollama(dom_content, parse_description, website_url, user_id)
            return Response({"parsed_content": parsed_result}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class RetreiveNotes(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        search_url = self.request.data.get("search_url", None)
        user_id = self.request.user.id

        try:
            print(search_url.strip() == "")
            if user_id and search_url and search_url.strip() != "":
                queryset = Note.objects.filter(user_id=user_id, url__contains=search_url)
            else:
                queryset = Note.objects.all()

            serializer = NoteSerializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class GetDomContent(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        search_url = self.request.data.get("search_url", None)
        try:
            if search_url:
                queryset = Note.objects.filter(url=search_url, is_dom_content=True)
                return Response({"result" : queryset[0].result})
            else:
                return Response({"error": "Dom content not found for this link"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            print(e)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        