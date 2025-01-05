from .scrape import split_dom_content
from .models import Note
import requests
import json


url = "http://52.158.29.202:11434/api/generate"

def extract_response(response):

    extracted = []

    response_splitted = response.split("\n")

    for item in response_splitted:
        if item.strip() != "":
            extracted.append(json.loads(item)["response"])

    return "".join(extracted)


def parse_with_ollama(dom_content, parse_description, website_url, user_id):

    parsed_result = []

    for chunk in split_dom_content(dom_content):
        try:

            template = f"""
                You are tasked with extracting specific information from the following text content: {chunk}. 
                Please follow these instructions carefully: \n\n
                1. **Extract Information:** Only extract the information that directly matches the provided description: {parse_description}. 
                2. **No Extra Content:** Do not include any additional text, comments, or explanations in your response. 
                3. **Empty Response:** If no information matches the description, return an empty string ('').
                4. **Direct Data Only:** Your output should contain only the data that is explicitly requested, with no other text.
            """

            payload = { 
                "model" : "llama3.1",
                "prompt" : template
            }

            response = requests.post(url, json = payload, timeout = 3600)

            parsed_result.append(extract_response(response.text))

        except requests.RequestException:
            return "Error while parsing..."
        
    note = Note(user_id = user_id, url = website_url, result = parsed_result, prompt = parse_description)
    note.save()

    return "\n".join(parsed_result)

    
