import google.generativeai as genai
import json
import os

def call_gemini(prompt_file_path, food_search_file_path, user_details):
    api_key = "AIzaSyCSOKBF43-12A_Ol3pG60UAn86dLrD6Iyc"  # Replace with your Gemini API key

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

    # Combine prompt, food search details, and user data into one prompt for the Gemini API
    full_prompt = (
        f"{prompt_text}\n\n"
        f"Food Search Details:\n{food_data}\n\n"
        f"User Details:\n{json.dumps(user_details, indent=4)}"
    )

    # Start a chat session with the Gemini API
    model = genai.GenerativeModel(model_name="gemini-1.5-flash", generation_config=generation_config)
    chat_session = model.start_chat(history=[])
    response = chat_session.send_message(full_prompt)

    # Output the result in text form
    response_text = response.text

    # Parse the response text to a JSON object
    response_json = json.loads(response_text)

    # Write the Gemini API response to /tmp/response.json for GCP compatibility
    response_file_path = os.path.join('/tmp', 'response.json')

    with open(response_file_path, 'w') as response_file:
        json.dump(response_json, response_file, indent=4)

    # Return the response directly without saving it to the old location
    return response_json
