from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .scrape import scrape_website
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
            html_content = scrape_website(website_url)
            return Response({"html_content": html_content}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class ParseContentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        dom_content = request.data.get("dom_content")
        parse_description = request.data.get("parse_description")
        
        if not dom_content:
            return Response({"error": "DOM content is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not parse_description:
            return Response({"error": "Parse description is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # temporary split the DOM content into chunks because the corresponding code is commented out
        # TODO: delete the below line and uncomment the code block in the parse.py file to enable splitting
        dom_chunks = [dom_content[i:i+5000] for i in range(0, len(dom_content), 5000)]

        try:
            parsed_result = parse_with_ollama(dom_chunks, parse_description)
            return Response({"parsed_content": parsed_result}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)