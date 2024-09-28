"use client";

import { Button } from "@/components/ui/button"; // Adjust the import path based on your project structure
import { Upload, Frown, Search } from "lucide-react";
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
        <h2 className="text-white mt-2">Analyzing...</h2>
      </div>
    </div>
  );
};

const FoodSearch = () => {
  const { user } = useUser();

  const [formData, setFormData] = useState({
    productName: "",
    ingredients: "",
    nutritionInfo: "",
    infoImage: null,
  });

  const [isEditable, setIsEditable] = useState(true);
  const [isAdded, setIsAdded] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [addedFood, setAddedFood] = useState(null);
  const [geminiResponse, setGeminiResponse] = useState(null);
  const [showFoodOutput, setShowFoodOutput] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleFileUpload = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
    setError(null); // Clear any previous errors when an image is selected
  };

  // Form validation
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('productName', formData.productName);
      formDataToSend.append('ingredients', formData.ingredients);
      formDataToSend.append('nutritionInfo', formData.nutritionInfo);
      if (formData.infoImage) formDataToSend.append('infoImage', formData.infoImage);

      const response = await fetch('http://localhost:8000/save-food-details', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage("Food details saved successfully!");

        setAddedFood({
          productName: data.productName || formData.productName,
          ingredients: data.ingredients || formData.ingredients,
          nutritionInfo: data.nutritionInfo || formData.nutritionInfo,
          infoImage: formData.infoImage,
        });

        setIsAdded(true);
        setIsEditable(false);
      } else {
        const errorData = await response.json();
        setError("Failed to save food details: " + errorData.message);
      }
    } catch (error) {
      setError("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle search action
  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/gemini-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();

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

        setGeminiResponse(parsedData);
        setShowFoodOutput(true);
        setSuccessMessage("");
      } else {
        setError("Failed to fetch Gemini API response");
      }
    } catch (error) {
      setError("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit action
  const handleEdit = () => {
    setIsEditable(true);
  };

  // Function to handle adding another food
  const handleAddAnother = () => {
    setFormData({
      productName: "",
      ingredients: "",
      nutritionInfo: "",
      infoImage: null,
    });
    setAddedFood(null);
    setGeminiResponse(null);
    setShowFoodOutput(false);
    setIsEditable(true);
    setIsAdded(false);
    setSuccessMessage("");
    setError(null);
  };

  return (
    <div className="flex flex-col lg:flex-row px-8 py-16 pt-28 gap-8 poppins-regular">
      {/* Full-Screen Loader */}
      {loading && <CustomLoader />}

      {!showFoodOutput && !loading && (
        <>
          <div className="lg:w-1/3 w-full bg-emerald-500 text-white bg-opacity-25 p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold mb-4">Add Food Product</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-white">Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  className="w-full p-2  bg-black placeholder-gray-500 text-white rounded-lg"
                  placeholder="Enter product name"
                  required
                  disabled={!isEditable}
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-white">Ingredients/Allergens</label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleChange}
                  className="w-full p-2 bg-black placeholder-gray-500 text-white rounded-lg"
                  placeholder="Enter ingredients or allergens"
                  rows="3"
                  disabled={!isEditable}
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-white">Nutritional Information</label>
                <textarea
                  name="nutritionInfo"
                  value={formData.nutritionInfo}
                  onChange={handleChange}
                  className="w-full p-2 bg-black placeholder-gray-500 text-white rounded-lg"
                  placeholder="Enter nutritional information"
                  rows="3"
                  disabled={!isEditable}
                />
              </div>

              <div className="mb-4">
                <p className="text-sm text-white">or upload an image with both ingredients and nutritional information:</p>

                {/* Upload Button as Label */}
                <label htmlFor="infoImage" className="flex text-white bg-black hover:bg-stone-800 items-center mt-2 p-2  border-gray-300 rounded-lg cursor-pointer justify-center">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </label>

                <input
                  id="infoImage"
                  type="file"
                  name="infoImage"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*"
                  disabled={!isEditable || !!formData.infoImage}
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
                    className="bg-white hover:bg-gray-300 text-black py-2 px-4 rounded-lg w-full"
                  >
                    {isAdded ? "Save" : "Add"}
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:w-2/3 w-full bg-black bg-opacity-80 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold mb-4 text-center">Food Details</h2>

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
              <div className="flex items-center justify-center h-full min-h-[200px] p-4 rounded-lg">
                
                <p>No food has been added yet.</p>
                <Frown className="ml-2" /> {/* Add the Frown icon with some margin */}

              </div>
            )}

            {addedFood && (
              <button
              onClick={handleSearch}
              className="mt-4 bg-emerald-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center"
              disabled={loading}
            >
              <Search className="mr-2 h-4 w-4" /> {/* Icon before the text with some margin */}
              Search
            </button>
            )}
          </div>

        </>
      )}

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