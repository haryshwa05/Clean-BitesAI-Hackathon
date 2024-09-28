import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Check, X, AlertCircle, Shield, Skull } from "lucide-react";

// Function to dynamically render color and icon for processing level
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

// Function to dynamically render harmful ingredients message
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

// Function to dynamically render user impact level with appropriate color and icon
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

export default function FoodOutput({ foodAnalysis = {} }) {
  // Provide default values to prevent errors if some data is missing
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

  const getProgressColor = (value) => {
    if (value >= 66) return "bg-green-500"; // High values (green)
    if (value >= 33) return "bg-yellow-500"; // Medium values (yellow)
    return "bg-red-500"; // Low values (red)
  };

  const renderNutrientScores = (scores) => {
    return Object.entries(scores).map(([nutrient, score]) => (
      <div key={nutrient} className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{nutrient}</span>
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

  return (
    <div className="container mx-auto space-y-8">
      <Card className="bg-black bg-opacity-70 text-white">
        <CardHeader>
          <CardTitle className="text-3xl">Food Analysis</CardTitle>
          <CardDescription>Detailed nutritional breakdown and dietary impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Processing Level</h3>
              {getProcessingBadge(processed)}

              <h3 className="text-lg font-semibold mt-6 mb-2">Harmful Ingredients</h3>
              {renderHarmfulIngredients(harmfulIngredients)}

              <h3 className="text-lg font-semibold mt-6 mb-2">Suitable Diets</h3>
              <div className="flex flex-wrap gap-2">
                {suitableDiets.map((diet) => (
                  <Badge key={diet} variant="outline" className="bg-green-100">
                    <Check className="w-3 h-3 mr-1" />
                    {diet}
                  </Badge>
                ))}
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-2">Not Suitable Diets</h3>
              <div className="flex flex-wrap gap-4">
                {notSuitableDiets.map((diet) => (
                  <Badge key={diet} variant="outline" className="bg-red-100 px-3 py-1">
                    <X className="w-3 h-3 mr-2" />
                    {diet}
                  </Badge>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">User Impact</h3>
                {getUserImpact(userImpact)}
                <p className="text-muted-foreground mb-4">{userImpactReason}</p>

                <h3 className="text-lg font-semibold mb-2">Actionable Steps</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {actionableSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Macronutrients</h3>
              {renderNutrientScores(macronutrientsScore)}

              <h3 className="text-lg font-semibold mt-6 mb-2">Micronutrients</h3>
              {renderNutrientScores(micronutrientsScore)}
            </div>
          </div>

          <Separator className="my-8" />
        </CardContent>
      </Card>
    </div>
  );
}
