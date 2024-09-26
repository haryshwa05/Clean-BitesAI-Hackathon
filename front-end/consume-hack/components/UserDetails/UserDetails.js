"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs"; // Clerk's useUser hook
import formOptionsData from "./formOptions.json";

export default function UserDetails() {
  const { user } = useUser(); // Get the currently authenticated user from Clerk
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    gender: "",
    healthIssue: "",
    allergy: "",
    goal: "",
  });
  const [isEditMode, setIsEditMode] = useState(false); // Track whether the user is editing existing data
  const [formOptions] = useState(formOptionsData);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch existing user data when the component loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/get-user-details/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData(data); // Populate the form with existing user data
          setIsEditMode(true); // Set to edit mode since data exists
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Form validation
  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        valid = false;
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required.`;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (validateForm()) {
      try {
        const endpoint = isEditMode
          ? `http://localhost:8000/update-user-details/${user.id}`
          : `http://localhost:8000/save-details`;

        const response = await fetch(endpoint, {
          method: "POST",  // Ensure this is POST for update or save
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, userId: user.id }), // Include user ID in the payload
        });

        if (response.ok) {
          const data = await response.json();
          setSuccessMessage("Form submitted successfully.");
        } else {
          const errorData = await response.json();
          setErrorMessage("Failed to submit the form: " + errorData.message);
        }
      } catch (error) {
        setErrorMessage("Error submitting form: " + error.message);
        console.error("Error submitting form:", error);
      }
    }
  };

  return (
    <div className="flex justify-center items-center pt-14 bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">{isEditMode ? "Edit" : "Submit"} User Details</h2>
        
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          {successMessage && <p className="text-green-500 text-center col-span-2">{successMessage}</p>}
          {errorMessage && <p className="text-red-500 text-center col-span-2">{errorMessage}</p>}

          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your name"
              required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          {/* Age */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.age ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your age"
              required
            />
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>

          {/* Height */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Height (in cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.height ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your height"
              required
            />
            {errors.height && <p className="text-red-500 text-sm">{errors.height}</p>}
          </div>

          {/* Weight */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Weight (in kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.weight ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your weight"
              required
            />
            {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.gender ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            >
              <option value="">Select Gender</option>
              {formOptions.genders.map((gender, index) => (
                <option key={index} value={gender}>{gender}</option>
              ))}
            </select>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
          </div>

          {/* Health Issues */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Health Issues</label>
            <select
              name="healthIssue"
              value={formData.healthIssue}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.healthIssue ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            >
              <option value="">Select Health Issue</option>
              {formOptions.healthIssues.map((issue, index) => (
                <option key={index} value={issue}>{issue}</option>
              ))}
            </select>
            {errors.healthIssue && <p className="text-red-500 text-sm">{errors.healthIssue}</p>}
          </div>

          {/* Allergies */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Allergies</label>
            <select
              name="allergy"
              value={formData.allergy}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.allergy ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            >
              <option value="">Select Allergy</option>
              {formOptions.allergies.map((allergy, index) => (
                <option key={index} value={allergy}>{allergy}</option>
              ))}
            </select>
            {errors.allergy && <p className="text-red-500 text-sm">{errors.allergy}</p>}
          </div>

          {/* Goals */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Goals</label>
            <select
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.goal ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            >
              <option value="">Select Goal</option>
              {formOptions.goals.map((goal, index) => (
                <option key={index} value={goal}>{goal}</option>
              ))}
            </select>
            {errors.goal && <p className="text-red-500 text-sm">{errors.goal}</p>}
          </div>

          {/* Submit Button */}
          <div className="text-center col-span-2">
            <button
              type="submit"
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isEditMode ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
