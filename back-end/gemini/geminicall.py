import google.generativeai as genai
import json
import os
import hashlib

def generate_hash(prompt_text, food_data):
    # Hash the combined prompt text and food details for consistency across all users
    combined_data = f"{prompt_text}{food_data}"
    return hashlib.md5(combined_data.encode()).hexdigest()

def call_gemini(prompt_file_path, food_search_file_path, user_details, output_file_path='response/response.json'):
    api_key = "AIzaSyCSOKBF43-12A_Ol3pG60UAn86dLrD6Iyc"
    
    # Configure the API key
    genai.configure(api_key=api_key)
    
    # Generation configuration for consistent response
    generation_config = {
        "temperature": 0,
        "top_p": 1,
        "top_k": 1,
        "max_output_tokens": 9192,
        "response_mime_type": "application/json",
    }

    # Load the main prompt from prompt.txt
    with open(prompt_file_path, 'r') as prompt_file:
        prompt_text = prompt_file.read()

    # Load the food search data from foodsearch.txt
    with open(food_search_file_path, 'r') as food_file:
        food_data = food_file.read()

    # Generate a hash of the input to use as a cache key
    product_hash = generate_hash(prompt_text, food_data)
    cached_file_path = f"cache/{product_hash}.json"

    # Check if there's a cached response for this food data and prompt
    if os.path.exists(cached_file_path):
        with open(cached_file_path, 'r') as cache_file:
            cached_response = json.load(cache_file)
            print(f"Returning cached response from {cached_file_path}")
            return cached_response

    # Combine prompt and food search details for the API request
    full_prompt = (
        f"{prompt_text}\n\n"
        f"Food Search Details:\n{food_data}"
    )

    # Start a chat session with the Gemini API
    model = genai.GenerativeModel(model_name="gemini-1.5-flash", generation_config=generation_config)
    chat_session = model.start_chat(history=[])
    response = chat_session.send_message(full_prompt)

    # Output the result in text form
    response_text = response.text

    # Parse the response text to a JSON object
    response_json = json.loads(response_text)

    # Cache the response for future identical requests
    cache_dir = os.path.dirname(cached_file_path)
    if not os.path.exists(cache_dir):
        os.makedirs(cache_dir)
    with open(cached_file_path, 'w') as cache_file:
        json.dump(response_json, cache_file, indent=4)

    print(f"Response has been cached to {cached_file_path}")

    # Return the response
    return response_json
