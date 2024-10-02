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
  const [isFormChanged, setIsFormChanged] = useState(false); // Track if the form is being edited
  const [formOptions] = useState(formOptionsData);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch existing user data when the component loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://cleanbitesai.el.r.appspot.com/get-user-details/${encodeURIComponent(user.id)}`);

        if (response.ok) {
          const data = await response.json();
          setFormData(data); // Populate the form with existing user data
          setIsFormChanged(false); // Ensure the form is not in edit mode by default
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
    setIsFormChanged(true); // Show save button when any field is changed
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
        // Ensure the endpoint is correct
        const endpoint = `https://cleanbitesai.el.r.appspot.com/update-user-details/${encodeURIComponent(user.id)}`;

        const response = await fetch(endpoint, {
          method: "POST", // Ensure this is POST for update
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, userId: user.id }), // Include user ID in the payload
        });

        if (response.ok) {
          const data = await response.json();
          setSuccessMessage("Form submitted successfully.");
          setIsFormChanged(false); // Hide the save button after saving

          // Automatically refresh the page
          window.location.reload();
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
    <div className="py-16 pt-28">
      <div className="flex justify-center items-center poppins-regular">
        <div className="w-full max-w-4xl bg-black bg-opacity-80 p-8 shadow-lg rounded-3xl">
          <h2 className="text-3xl md:text-5xl mb-6 text-center text-white">Your Details</h2>

          <form className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2" onSubmit={handleSubmit}>
            {successMessage && <p className="text-green-500 text-center col-span-1 md:col-span-2">{successMessage}</p>}
            {errorMessage && <p className="text-red-500 text-center col-span-1 md:col-span-2">{errorMessage}</p>}

            {/* Name */}
            <div className="col-span-1">
              <label className="block text-white font-semibold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 border bg-black placeholder-gray-500 text-white ${errors.name ? "border-red-500" : "border-gray-800"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your name"
                required
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* Age */}
            <div className="col-span-1">
              <label className="block text-white font-semibold mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={`w-full p-3 border bg-black placeholder-gray-500 text-white ${errors.age ? "border-red-500" : "border-gray-800"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your age"
                required
              />
              {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
            </div>

            {/* Height */}
            <div className="col-span-1">
              <label className="block text-white font-semibold mb-2">Height (in cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className={`w-full p-3 border bg-black placeholder-gray-500 text-white ${errors.height ? "border-red-500" : "border-gray-800"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your height"
                required
              />
              {errors.height && <p className="text-red-500 text-sm">{errors.height}</p>}
            </div>

            {/* Weight */}
            <div className="col-span-1">
              <label className="block text-white font-semibold mb-2">Weight (in kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className={`w-full p-3 border bg-black placeholder-gray-500 text-white ${errors.weight ? "border-red-500" : "border-gray-800"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your weight"
                required
              />
              {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
            </div>

            {/* Gender */}
            <div className="col-span-1">
              <label className="block text-white font-semibold mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full p-3 border bg-black placeholder-gray-500 text-white ${errors.gender ? "border-red-500" : "border-gray-800"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
            <div className="col-span-1">
              <label className="block text-white font-semibold mb-2">Health Issues</label>
              <select
                name="healthIssue"
                value={formData.healthIssue}
                onChange={handleChange}
                className={`w-full p-3 border bg-black placeholder-gray-500 text-white ${errors.healthIssue ? "border-red-500" : "border-gray-800"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
            <div className="col-span-1">
              <label className="block text-white font-semibold mb-2">Allergies</label>
              <select
                name="allergy"
                value={formData.allergy}
                onChange={handleChange}
                className={`w-full p-3 border bg-black placeholder-gray-500 text-white ${errors.allergy ? "border-red-500" : "border-gray-800"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
            <div className="col-span-1">
              <label className="block text-white font-semibold mb-2">Goals</label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className={`w-full p-3 border bg-black placeholder-gray-500 text-white ${errors.goal ? "border-red-500" : "border-gray-800"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
            {isFormChanged && (
              <div className="text-center col-span-1 md:col-span-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
