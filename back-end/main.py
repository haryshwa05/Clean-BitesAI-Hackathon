import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from userdetails_back.user_details import save_user_data, get_user_data
from gemini.geminicall import call_gemini  # Import the call_gemini function from the module
from gemini.gemini_image import extract_text_from_image  # Import the image text extraction function
import traceback

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["https://cleanbitesai.vercel.app", "http://localhost:3000"]}})


# Clerk API Key
API_KEY = "••••••••••••••••••••••••••••••••••••••••••••"  # Replace with your actual API key

# New Route for extracting text from an image using the Gemini API
@app.route('/extract-text-from-image', methods=['POST'])
def extract_text():
    """Extract text from an uploaded image using the Gemini API."""
    try:
        # Get the uploaded file from the request
        if 'image' not in request.files:
            return jsonify({"message": "No image file provided"}), 400

        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({"message": "No selected image file"}), 400

        # Use the /tmp directory for temporary file storage
        image_path = os.path.join('/tmp', 'temp_image.png')
        image_file.save(image_path)

        # Extract text from the image using the Gemini API
        extracted_text = extract_text_from_image(image_path)

        # Remove the temporary image file
        os.remove(image_path)

        # Return the extracted text
        return jsonify({"extracted_text": extracted_text}), 200

    except Exception as e:
        print("An error occurred while extracting text from image:")
        traceback.print_exc()
        return jsonify({"message": "Failed to extract text from image", "error": str(e)}), 500


@app.route('/save-details', methods=['POST'])
def save_details():
    """Save new user details using Clerk's userId."""
    try:
        # Get the JSON data from the request
        data = request.get_json()

        # Debugging: Print the received data
        print("Received Data:", data)

        # Check if the data contains the userId (from Clerk)
        if not data or 'userId' not in data:
            return jsonify({"message": "Invalid data received: Missing userId"}), 400

        # Save the user data (assuming save_user_data is implemented)
        user_id = save_user_data(data)

        return jsonify({"message": "Details saved successfully", "user_id": user_id}), 200
    except Exception as e:
        # Print full traceback for better debugging
        print("An error occurred while saving details:")
        traceback.print_exc()
        return jsonify({"message": "Failed to save details", "error": str(e)}), 500

@app.route('/get-user-details/<user_id>', methods=['GET'])
def get_user_details(user_id):
    """Fetch existing user details using Clerk's userId."""
    try:
        data = get_user_data(user_id)

        # If the file exists, return the data
        if data:
            return jsonify(data), 200
        else:
            return jsonify({"message": "No user details found for this user ID."}), 404
    except Exception as e:
        print("An error occurred while fetching user details:")
        traceback.print_exc()
        return jsonify({"message": "Failed to fetch details", "error": str(e)}), 500

@app.route('/update-user-details/<user_id>', methods=['POST'])
def update_user_details(user_id):
    """Update existing user details using Clerk's userId."""
    try:
        # Get the JSON data from the request
        data = request.get_json()

        # Debugging: Print the received data
        print("Received Data for update:", data)

        # Check if the data contains valid userId (from Clerk)
        if not data or 'userId' not in data or data['userId'] != user_id:
            return jsonify({"message": "Invalid data received: userId mismatch"}), 400

        # Save the updated user data (assuming save_user_data is implemented)
        save_user_data(data)

        return jsonify({"message": "Details updated successfully"}), 200
    except Exception as e:
        # Print full traceback for better debugging
        print("An error occurred while updating details:")
        traceback.print_exc()
        return jsonify({"message": "Failed to update details", "error": str(e)}), 500

# New Route for saving food details
# New Route for saving food details
@app.route('/save-food-details', methods=['POST'])
def save_food_details():
    """Save or replace food search details in a file."""
    try:
        # Check if an image file is provided in the request (FormData)
        if 'infoImage' in request.files or request.form:
            if 'infoImage' in request.files:
                image_file = request.files['infoImage']
                if image_file.filename == '':
                    return jsonify({"message": "No selected image file"}), 400

                # Use the /tmp directory for temporary file storage
                image_path = os.path.join('/tmp', 'temp_image.png')
                image_file.save(image_path)

                # Extract text from the image using the Gemini API
                extracted_text = extract_text_from_image(image_path)

                # Parse the extracted text as JSON (assuming the extraction returns JSON formatted text)
                data = json.loads(extracted_text)

                # Remove the temporary image file
                os.remove(image_path)
            else:
                # If no image, use form data directly
                data = {
                    'productName': request.form.get('productName', ''),
                    'ingredients': request.form.get('ingredients', ''),
                    'nutritionInfo': request.form.get('nutritionInfo', '')
                }
        else:
            data = request.get_json()

            # Validate the data (Check if required fields are present)
            if not data or 'productName' not in data or 'ingredients' not in data:
                return jsonify({"message": "Invalid data received: Missing required fields"}), 400

        # Debugging: Print the data to be saved
        print("Food Data to be saved:", data)

        # Use the /tmp directory for saving food details
        file_path = os.path.join('/tmp', 'foodsearch.txt')

        # Save food details to the file (Overwrite mode)
        with open(file_path, 'w') as f:  # 'w' mode to overwrite the file
            f.write(json.dumps(data, indent=4))  # Write data with indentation

        return jsonify(data), 200  # Return the saved data
    except Exception as e:
        # Print the full traceback for better debugging
        print("An error occurred while saving food details:")
        traceback.print_exc()
        return jsonify({"message": "Failed to save food details", "error": str(e)}), 500

# Other existing routes...
# Route for calling the Gemini API
@app.route('/gemini-call', methods=['POST'])
def gemini_call():
    """Trigger a Gemini call and return the response."""
    try:
        # Extract the userId from the POST request
        data = request.get_json()
        user_id = data.get("userId")

        if not user_id:
            return jsonify({"message": "User ID is missing"}), 400

        # Paths to the required files
        prompt_file_path = 'prompt.txt'  # Main prompt template
        food_search_file_path = os.path.join('/tmp', 'foodsearch.txt')  # Use /tmp directory for food search data

        # Fetch the most recent user details based on the userId
        user_details = get_user_data(user_id)
        if not user_details:
            return jsonify({"message": f"User details for {user_id} not found."}), 404

        # Debugging: Print user details
        print("User Details: ", user_details)

        # Call the Gemini API with the latest user data and food search details
        response_data = call_gemini(prompt_file_path, food_search_file_path, user_details)

        # Print the response for debugging purposes
        print("Gemini API Response: ", response_data)

        # Return the response to the frontend
        return jsonify(response_data), 200
    except Exception as e:
        print("An error occurred during the Gemini API call:")
        traceback.print_exc()
        return jsonify({"message": "Failed to process Gemini call", "error": str(e)}), 500


if __name__ == '__main__':
    # Running the Flask app on port 8000 in debug mode
    app.run(port=8000, debug=True)
