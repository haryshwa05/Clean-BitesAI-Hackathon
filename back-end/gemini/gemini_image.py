import os
import google.generativeai as genai

# Function to extract text from an image using the Gemini API
def extract_text_from_image(image_path):
    # Configure API with your key
    genai.configure(api_key="AIzaSyCSOKBF43-12A_Ol3pG60UAn86dLrD6Iyc")

    # Choose the Gemini model
    model = genai.GenerativeModel(model_name="gemini-1.5-flash")

    # Define the path to the prompt file (located in the same directory as this script)
    prompt_file_path = os.path.join(os.path.dirname(__file__), 'image-prompt.txt')

    # Read the prompt text from the file
    with open(prompt_file_path, 'r') as file:
        prompt = file.read().strip()

    # Upload the image to the Gemini API
    uploaded_image = genai.upload_file(image_path)

    # Generate content by combining the image and prompt
    response = model.generate_content([uploaded_image, "\n\n", prompt])

    # Return only the extracted text from the image
    return response.text
