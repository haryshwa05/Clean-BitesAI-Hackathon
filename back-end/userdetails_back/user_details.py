import os
import json

def get_unique_filename(user_id, folder):
    """
    Generate a unique file path for the user based on Clerk's userId.
    The filename is the userId, ensuring uniqueness.
    """
    return os.path.join(folder, f'{user_id}.txt')


def save_user_data(data):
    """
    Save the user details using Clerk's userId.
    The data is saved in a file named after the userId.
    """
    user_id = data.get('userId')
    if not user_id:
        raise ValueError("UserId is required to save user data.")

    # Ensure the user details folder exists
    user_details_folder = os.path.join(os.getcwd(), 'userdetails_back')
    if not os.path.exists(user_details_folder):
        os.makedirs(user_details_folder)

    # Get the unique file path for the userId
    file_path = get_unique_filename(user_id, user_details_folder)

    # Save the user data to the file as JSON
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4)

    return user_id


def get_user_data(user_id):
    """
    Fetch existing user details based on Clerk's userId.
    Returns the user data if found, otherwise returns None.
    """
    # Ensure the user details folder exists
    user_details_folder = os.path.join(os.getcwd(), 'userdetails_back')
    if not os.path.exists(user_details_folder):
        os.makedirs(user_details_folder)

    # Build the file path using the userId
    file_path = get_unique_filename(user_id, user_details_folder)

    # Check if the file exists
    if os.path.exists(file_path):
        # Read and return the user data from the file
        with open(file_path, 'r') as f:
            return json.load(f)
    else:
        return None
