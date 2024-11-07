from langchain_ollama import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from .scrape import split_dom_content
from .models import Note

template = (
    "You are tasked with extracting specific information from the following text content: {dom_content}. "
    "Please follow these instructions carefully: \n\n"
    "1. **Extract Information:** Only extract the information that directly matches the provided description: {parse_description}. "
    "2. **No Extra Content:** Do not include any additional text, comments, or explanations in your response. "
    "3. **Empty Response:** If no information matches the description, return an empty string ('')."
    "4. **Direct Data Only:** Your output should contain only the data that is explicitly requested, with no other text."
)

model = OllamaLLM(model="llama3.1")

def parse_with_ollama(dom_content, parse_description, website_url, user_id):
    prompt = ChatPromptTemplate.from_template(template)
    chain = prompt | model
    
    parsed_results = []

    dom_chunks = split_dom_content(dom_content)

    for i, chunk in enumerate(dom_chunks, start=1):
        print(f"Parsing {i} / {len(dom_chunks)}")
        response = chain.invoke(
            {"dom_content": chunk, "parse_description": parse_description}
        )
        parsed_results.append(response)

    note = Note(user_id = user_id, url = website_url, result = parsed_results, prompt = parse_description)
    note.save()

    return "\n".join(parsed_results)