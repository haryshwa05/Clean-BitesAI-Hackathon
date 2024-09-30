"use client";

import { useEffect } from "react";
import Link from 'next/link';
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Check, X, AlertCircle, Shield, Skull } from "lucide-react";

// Import ApexCharts dynamically to avoid SSR issues with Next.js
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const getProcessingBadge = (level) => {
  if (!level) return <Badge variant="default">Unknown</Badge>;
  switch (level.toLowerCase()) {
    case "not processed":
      return <Badge variant="default">Not Processed</Badge>;
    case "low":
      return <Badge variant="success">Low</Badge>;
    case "medium":
      return <Badge variant="warning">Medium</Badge>;
    case "highly processed":
      return <Badge variant="destructive">Highly Processed</Badge>;
    default:
      return <Badge variant="default">Unknown</Badge>;
  }
};

const renderHarmfulIngredients = (ingredients = []) => {
  if (ingredients.length === 0 || ingredients[0].toLowerCase() === "none") {
    return (
      <div className="bg-green-100 text-green-700 p-4 rounded-md">
        <p className="font-medium mb-2">No harmful ingredients.</p>
      </div>
    );
  }
  return (
    <div className="bg-destructive/10 text-destructive p-4 rounded-md">
      <p className="font-medium mb-2">{ingredients[0]}</p>
      <p className="text-sm">{ingredients[1]}</p>
    </div>
  );
};

const getUserImpact = (impact) => {
  if (!impact) return <span className="font-medium">No Impact Data</span>;
  switch (impact.toLowerCase()) {
    case "risk free":
      return (
        <div className="flex items-center mb-4 text-green-500">
          <Shield className="w-5 h-5 mr-2" />
          <span className="font-medium">Risk Free</span>
        </div>
      );
    case "low risk":
      return (
        <div className="flex items-center mb-4 text-blue-500">
          <Check className="w-5 h-5 mr-2" />
          <span className="font-medium">Low Risk</span>
        </div>
      );
    case "medium risk":
      return (
        <div className="flex items-center mb-4 text-yellow-500">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span className="font-medium">Medium Risk</span>
        </div>
      );
    case "high risk":
      return (
        <div className="flex items-center mb-4 text-red-500">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span className="font-medium">High Risk</span>
        </div>
      );
    case "fatal":
      return (
        <div className="flex items-center mb-4 text-red-700">
          <Skull className="w-5 h-5 mr-2" />
          <span className="font-medium">Fatal</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center mb-4 text-gray-500">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span className="font-medium">Unknown Risk</span>
        </div>
      );
  }
};

const getProgressColor = (value) => {
  if (value >= 66) return "bg-green-500"; // High values (green)
  if (value >= 33) return "bg-yellow-500"; // Medium values (yellow)
  return "bg-red-500"; // Low values (red)
};

const renderNutrientScores = (scores) => {
  return Object.entries(scores).map(([nutrient, score]) => (
    <div key={nutrient} className="flex items-center justify-between mb-2">
      <span className="text-xs md:text-sm font-medium">{nutrient}</span>
      {score !== "N/A" ? (
        <div className="w-1/2 h-2 rounded bg-gray-800">
          <div
            className={`h-full rounded ${getProgressColor(parseInt(score))}`}
            style={{ width: `${parseInt(score)}%` }}
          ></div>
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">N/A</span>
      )}
    </div>
  ));
};

export default function FoodOutput({ foodAnalysis = {} }) {
  const {
    processed = "Unknown",
    harmfulIngredients = [],
    suitableDiets = [],
    notSuitableDiets = [],
    macronutrientsScore = {},
    micronutrientsScore = {},
    userImpact = "Unknown",
    userImpactReason = "No reason provided",
    actionableSteps = [],
  } = foodAnalysis;

  // Filter out micronutrients with a score of zero or 'N/A'
  const filteredMicronutrients = Object.entries(micronutrientsScore)
    .filter(([_, score]) => score !== "N/A" && parseFloat(score) > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3); // Top 3 micronutrients

  const defaultNoDataMessage = "No data available"; // Default no data message

  const micronutrientChartData = {
    series: filteredMicronutrients.length > 0 ? filteredMicronutrients.map(([_, score]) => parseFloat(score)) : [],
    options: {
      chart: {
        type: "donut",
        height: '100%',
        width: '100%',
      },
      labels: filteredMicronutrients.map(([nutrient]) => nutrient),
      colors: ['#06b6d4', '#f43f5e', '#9333ea'],
      dataLabels: { enabled: false },
      stroke: { show: false, width: 0 },
      legend: {
        position: 'bottom',
        labels: { colors: ["#FFFFFF"] },
      },
      noData: {
        text: defaultNoDataMessage,
        align: 'center',
        verticalAlign: 'middle',
        style: {
          color: '#ffffff',
          fontSize: '16px',
        },
      },
      responsive: [
        {
          breakpoint: 640,  // Mobile screens
          options: {
            chart: {
              width: '250px',
              height: '250px',
            },
          },
        },
      ],
    },
  };

  const macronutrientTotal = parseFloat(macronutrientsScore?.Carbohydrates || 0) +
    parseFloat(macronutrientsScore?.Proteins || 0) +
    parseFloat(macronutrientsScore?.Fats || 0);

  const macronutrientChartData = {
    series: macronutrientTotal > 0 ? [
      parseFloat(macronutrientsScore?.Carbohydrates || 0),
      parseFloat(macronutrientsScore?.Proteins || 0),
      parseFloat(macronutrientsScore?.Fats || 0),
    ] : [],
    options: {
      chart: {
        type: "donut",
        height: '100%',
        width: '100%',
      },
      labels: ["Carbohydrates", "Proteins", "Fats"],
      colors: ['#3b82f6', '#22c55e', '#eab308'],
      dataLabels: { enabled: false },
      stroke: { show: false, width: 0 },
      legend: {
        position: 'bottom',
        labels: { colors: ["#FFFFFF"] },
      },
      noData: {
        text: defaultNoDataMessage,
        align: 'center',
        verticalAlign: 'middle',
        style: {
          color: '#ffffff',
          fontSize: '16px',
        },
      },
      responsive: [
        {
          breakpoint: 640,  // Mobile screens
          options: {
            chart: {
              width: '250px',
              height: '250px',
            },
          },
        },
      ],
    },
  };

  const micronutrientTotal = filteredMicronutrients.reduce((acc, [_, score]) => acc + parseFloat(score), 0);

  return (
    <div className="container mx-auto space-y-8 p-4">
      <Card className="bg-black bg-opacity-70 text-white">
        <CardHeader>
          <CardTitle className="text-3xl sm:text-4xl">Food Analysis</CardTitle>
          <CardDescription className="text-base sm:text-lg">Detailed nutritional breakdown and dietary impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {/* Left Section: Processing Level */}
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2">Processing Level</h3>
              {getProcessingBadge(processed)}
            </div>

            {/* Macronutrients and Macronutrient Scores side by side */}
            <div className="lg:col-span-2 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-2">Macronutrients</h3>
                {macronutrientTotal > 0 ? (
                  <div className="mb-8">
                    <ReactApexChart options={macronutrientChartData.options} series={macronutrientChartData.series} type="donut" />
                  </div>
                ) : (
                  <div className="mb-8">
                    <ReactApexChart options={macronutrientChartData.options} series={[]} type="donut" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4">Macronutrient Scores</h3>
                {renderNutrientScores(macronutrientsScore)}
              </div>
            </div>

            {/* Micronutrients and Micronutrient Scores side by side */}
            <div className="lg:col-span-2 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-2">Micronutrients</h3>
                {micronutrientTotal > 0 ? (
                  <div className="mb-8">
                    <ReactApexChart options={micronutrientChartData.options} series={micronutrientChartData.series} type="donut" />
                  </div>
                ) : (
                  <div className="mb-8">
                    <ReactApexChart options={micronutrientChartData.options} series={[]} type="donut" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4">Micronutrient Scores</h3>
                {renderNutrientScores(micronutrientsScore)}
              </div>
            </div>

            {/* Bottom Section: All other information */}
            <div className="lg:col-span-2">
              <h3 className="text-xl sm:text-2xl font-semibold mt-6 mb-2">Harmful Ingredients</h3>
              {renderHarmfulIngredients(harmfulIngredients)}

              <h3 className="text-xl sm:text-2xl font-semibold mt-6 mb-2">Suitable Diets</h3>
              <div className="flex flex-wrap gap-2">
                {suitableDiets.map((diet) => (
                  <Badge key={diet} variant="outline" className="bg-green-100">
                    <Check className="w-3 h-3 mr-1" />
                    {diet}
                  </Badge>
                ))}
              </div>

              <h3 className="text-xl sm:text-2xl font-semibold mt-6 mb-2">Not Suitable Diets</h3>
              <div className="flex flex-wrap gap-4">
                {notSuitableDiets.map((diet) => (
                  <Badge key={diet} variant="outline" className="bg-red-100 px-3 py-1">
                    <X className="w-3 h-3 mr-2" />
                    {diet}
                  </Badge>
                ))}
              </div>

              <h3 className="text-xl sm:text-2xl font-semibold mt-8 mb-2">User Impact</h3>
              {getUserImpact(userImpact)}
              <p className="text-muted-foreground mb-4">{userImpactReason}</p>

              <h3 className="text-xl sm:text-2xl font-semibold mb-2">Actionable Steps</h3>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                {actionableSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
              <div className="mt-8 text-center">
                <button
                  className="bg-emerald-500 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg"
                  onClick={() => window.location.reload()}
                >
                  Add Another
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
