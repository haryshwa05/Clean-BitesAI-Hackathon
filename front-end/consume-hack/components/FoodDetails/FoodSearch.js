"use client";

import "./FoodSearch.css";
import { useState } from "react";
import { useUser } from "@clerk/nextjs"; // Clerk's useUser hook
import FoodOutput from "./FoodOutput";  // Ensure you import the FoodOutput component

const CustomLoader = () => {
  return (
    <div className="loading-overlay">
      <div className="loading">
        <svg width="64px" height="48px">
          <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="back"></polyline>
          <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="front"></polyline>
        </svg>
        <h2>Analyzing...</h2>
      </div>
    </div>
  );
};

const FoodSearch = () => {
  const { user } = useUser(); // Get the current logged-in user's information

  const [formData, setFormData] = useState({
    productName: "",
    ingredients: "",
    nutritionInfo: "",
    infoImage: null, // Combined image field
  });

  const [isEditable, setIsEditable] = useState(true); // State to handle form fields' editability
  const [isAdded, setIsAdded] = useState(false); // State to track if the data has been added
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [addedFood, setAddedFood] = useState(null);
  const [geminiResponse, setGeminiResponse] = useState(null);
  const [showFoodOutput, setShowFoodOutput] = useState(false); // State to toggle between food search and output
  const [loading, setLoading] = useState(false); // Loading state for full-screen loader

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleFileUpload = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  // Form validation: Ensure at least text input or image is provided
  const validateForm = () => {
    if (!formData.productName) {
      setError("Please enter the Product Name.");
      return false;
    }
    if (!formData.ingredients && !formData.nutritionInfo && !formData.infoImage) {
      setError("Please provide either Ingredients/Allergens text, Nutritional Information text, or upload an image.");
      return false;
    }
    setError(null);
    return true;
  };

  // Handle form submission (Add/Save)
  // Handle form submission (Add/Save)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true); // Start the loader when form submission begins

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('productName', formData.productName);
      formDataToSend.append('ingredients', formData.ingredients);
      formDataToSend.append('nutritionInfo', formData.nutritionInfo);
      if (formData.infoImage) formDataToSend.append('infoImage', formData.infoImage);

      const response = await fetch('http://localhost:8000/save-food-details', {
        method: 'POST',
        body: formDataToSend, // Sending FormData with file and text data
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage("Food details saved successfully!");

        // Set addedFood to the data returned from the backend
        setAddedFood({
          productName: data.productName || formData.productName,
          ingredients: data.ingredients || formData.ingredients,
          nutritionInfo: data.nutritionInfo || formData.nutritionInfo,
          infoImage: formData.infoImage, // retain the uploaded image if it exists
        });

        // Update the state to reflect that the details have been added
        setIsAdded(true);
        setIsEditable(false); // Disable fields after adding

        console.log("Food details saved:", data);
      } else {
        const errorData = await response.json();
        setError("Failed to save food details: " + errorData.message);
      }
    } catch (error) {
      setError("An error occurred: " + error.message);
      console.error("Error:", error);
    } finally {
      setLoading(false); // Stop the loader after processing is complete
    }
  };


  // Handle search action (for search button)
  const handleSearch = async () => {
    setLoading(true);  // Start loader
    try {
      const response = await fetch('http://localhost:8000/gemini-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id, // Pass the logged-in user's ID
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Update geminiResponse with the correctly mapped data
        const parsedData = {
          processed: data.processed || "Unknown",
          harmfulIngredients: Array.isArray(data.harmfulIngredients)
            ? data.harmfulIngredients
            : [data.harmfulIngredients || "Unknown"],
          suitableDiets: data.suitableDiets || [],
          notSuitableDiets: data.notSuitableDiets || [],
          macronutrientsScore: data.macroNutrientsScore || {},
          micronutrientsScore: data.microNutrientsScore || {},
          userImpact: data.userRisk || "Unknown",
          userImpactReason: data.userRiskReason || "No reason provided",
          actionableSteps: data.actionableSteps || []
        };

        setGeminiResponse(parsedData); // Set the mapped response
        setShowFoodOutput(true);       // Show food output and hide search form
        setSuccessMessage("");         // Clear the success message once the search is initiated
        console.log("Gemini API response:", parsedData);
      } else {
        setError("Failed to fetch Gemini API response");
      }
    } catch (error) {
      setError("An error occurred: " + error.message);
      console.error("Error:", error);
    } finally {
      setLoading(false);  // Stop loader
    }
  };

  // Handle edit action
  const handleEdit = () => {
    setIsEditable(true);  // Enable fields for editing
  };

  // Function to handle adding another food
  const handleAddAnother = () => {
    // Reset form and gemini response, and show the food search form again
    setFormData({
      productName: "",
      ingredients: "",
      nutritionInfo: "",
      infoImage: null, // Reset the combined image field
    });
    setAddedFood(null);
    setGeminiResponse(null);
    setShowFoodOutput(false);
    setIsEditable(true); // Enable fields for the new entry
    setIsAdded(false); // Reset the added state
    setSuccessMessage("");  // Clear the success message
    setError(null);         // Clear any error
  };

  return (
    <div className="flex flex-col lg:flex-row pt-16 gap-8">
      {/* Full-Screen Loader */}
      {loading && <CustomLoader />}

      {/* Show Search Form and Food Details if the output is not shown and no loading */}
      {!showFoodOutput && !loading && (
        <>
          {/* Search Section */}
          <div className="lg:w-1/3 w-full bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add Food Product</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter product name"
                  required
                  disabled={!isEditable} // Disable when not editable
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">Ingredients/Allergens</label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter ingredients or allergens"
                  rows="3"
                  disabled={!isEditable} // Disable when not editable
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">Nutritional Information</label>
                <textarea
                  name="nutritionInfo"
                  value={formData.nutritionInfo}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter nutritional information"
                  rows="3"
                  disabled={!isEditable} // Disable when not editable
                />
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600">or upload an image with both ingredients and nutritional information:</p>
                <input
                  type="file"
                  name="infoImage"
                  onChange={handleFileUpload}
                  className="mt-2"
                  accept="image/*"
                  disabled={!isEditable || !!formData.infoImage} // Disable when not editable or if image already uploaded
                />
                {formData.infoImage && <p>Uploaded Image: {formData.infoImage.name}</p>}
              </div>

              {error && <p className="text-red-500 mb-4">{error}</p>}
              {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

              <div className="flex gap-4">
                {!isEditable && isAdded && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg w-full"
                  >
                    Edit
                  </button>
                )}

                {(isEditable || !isAdded) && (
                  <button
                    type="submit"
                    className="bg-black hover:bg-gray-900 text-white py-2 px-4 rounded-lg w-full"
                  >
                    {isAdded ? "Save" : "Add"}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Result Section */}
          <div className="lg:w-2/3 w-full bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Food Details</h2>

            {/* Display the added food in the result section */}
            {addedFood ? (
              <div className="border border-gray-300 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  {addedFood.productName || "Product Name Not Provided"}
                </h3>
                <p className="mb-2">
                  <strong>Ingredients:</strong> {addedFood.ingredients || "N/A"}
                </p>
                <p>
                  <strong>Nutritional Info:</strong> {addedFood.nutritionInfo || "N/A"}
                </p>
                {addedFood.infoImage && (
                  <p>
                    <strong>Uploaded Info Image:</strong> {addedFood.infoImage.name}
                  </p>
                )}
              </div>
            ) : (
              <p>No food has been added yet.</p>
            )}

            {/* Render the search button below the food details */}
            {addedFood && (
              <button
                onClick={handleSearch}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                disabled={loading} // Disable the button while loading
              >
                Search
              </button>
            )}
          </div>
        </>
      )}

      {/* Show the Food Output and the Add Another button when geminiResponse is available */}
      {showFoodOutput && geminiResponse && (
        <div className="w-full">
          <FoodOutput foodAnalysis={geminiResponse} />

          <div className="mt-8 text-center">
            <button
              onClick={handleAddAnother}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
              Add Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodSearch;
