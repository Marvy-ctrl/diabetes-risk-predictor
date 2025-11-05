"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

import { Svg, Path } from "@react-pdf/renderer";

const ActivityIcon = () => (
  <Svg viewBox="0 0 24 24" width="24" height="24">
    <Path
      d="M22 12h-4l-3 9L9 3l-3 9H2"
      stroke="#2563EB"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

const pdfStyles = StyleSheet.create({
  page: { padding: 20, backgroundColor: "#f5f5f5" },
  section: { marginBottom: 10 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    textDecoration: "underline",
  },
  logoIcon: { width: 24, height: 24, marginRight: 8 },
  appName: { fontSize: 16, fontWeight: "bold" },
  heading: {
    fontSize: 14,
    marginBottom: 10,
    marginTop: 10,
    fontWeight: "bold",
  },
  subheading: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  field: { fontSize: 11, marginBottom: 5 },
});

interface FormValues {
  Gender: string;
  Pregnancies?: number;
  Age: number;
  Weight: number;
  Height: number;
  Glucose: number;
  BloodPressure: number;
  SkinThickness: number;
  Insulin: number;
  FamilyParents: string;
  FamilySiblings: string;
  FamilyGrandparents: string;
}

interface PredictionResult {
  message: string;
  confidence?: string | number;
}

interface ResultPDFProps {
  values: FormValues;
  result: PredictionResult;
}

type ResultType = "Diabetic" | "Not Diabetic";

interface Advice {
  title: string;
  diet: string[];
  exercise: string[];
  lifestyle: string[];
}

const healthAdvice: Record<ResultType, Advice> = {
  Diabetic: {
    title: "Health Advice for Diabetes Management",
    diet: [
      "Eat high fiber foods like vegetables and whole grains.",
      "Avoid sugary drinks and limit carbs.",
      "Control portion sizes and monitor blood sugar levels.",
    ],
    exercise: [
      "Engage in light to moderate exercise daily, such as walking or swimming.",
      "Avoid long sedentary periods move every 30 minutes.",
      "Check blood sugar before and after intense workouts.",
    ],
    lifestyle: [
      "Take medications as prescribed.",
      "Track glucose regularly.",
      "Get enough rest and reduce stress.",
    ],
  },
  "Not Diabetic": {
    title: "Health Advice for Low Diabetes Risk",
    diet: [
      "Maintain a balanced diet with plenty of vegetables, whole grains, and lean proteins.",
      "Limit refined sugars and processed foods.",
      "Stay hydrated aim for at least 8 cups of water daily.",
    ],
    exercise: [
      "Engage in at least 30 minutes of physical activity most days of the week.",
      "Incorporate strength training twice a week.",
      "Take regular walks after meals to regulate blood sugar.",
    ],
    lifestyle: [
      "Get 7-8 hours of sleep nightly.",
      "Manage stress through mindfulness or meditation.",
      "Avoid smoking and limit alcohol intake.",
    ],
  },
};

const ResultPDF: React.FC<ResultPDFProps> = ({ values, result }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <ActivityIcon />
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "black",
            marginLeft: 5,
          }}
        >
          GlucoSense
        </Text>
      </View>

      <Text style={pdfStyles.heading}>Diabetes Risk Assessment Report</Text>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Basic Information</Text>
        <Text style={pdfStyles.field}>Age: {values.Age}</Text>
        <Text style={pdfStyles.field}>Gender: {values.Gender}</Text>
        {values.Gender === "female" && (
          <Text style={pdfStyles.field}>Pregnancies: {values.Pregnancies}</Text>
        )}
        <Text style={pdfStyles.sectionTitle}>Physical Measurements</Text>
        <Text style={pdfStyles.field}>Weight: {values.Weight} kg</Text>
        <Text style={pdfStyles.field}>Height: {values.Height} m</Text>
        <Text style={pdfStyles.field}>
          Skin Thickness: {values.SkinThickness}
        </Text>
        <Text style={pdfStyles.sectionTitle}>Clinical Measurements</Text>
        <Text style={pdfStyles.field}>Glucose: {values.Glucose}</Text>
        <Text style={pdfStyles.field}>
          Blood Pressure: {values.BloodPressure}
        </Text>

        <Text style={pdfStyles.field}>Insulin: {values.Insulin}</Text>
        <Text style={pdfStyles.sectionTitle}>Family History</Text>

        <Text style={pdfStyles.field}>
          Family - Parents: {values.FamilyParents}, Siblings:{" "}
          {values.FamilySiblings}, Grandparents: {values.FamilyGrandparents}
        </Text>
      </View>

      {result && (
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.heading}>Result</Text>
          <Text style={pdfStyles.field}>Assessment: {result.message}</Text>
          <Text style={pdfStyles.field}>
            Confidence Level: {result.confidence}
          </Text>
        </View>
      )}

      {result && (
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.heading}>Health Advice</Text>
          <Text style={pdfStyles.subheading}>Diet</Text>
          {healthAdvice[result.message as ResultType].diet.map((tip, i) => (
            <Text key={i} style={pdfStyles.field}>
              • {tip}
            </Text>
          ))}

          <Text style={pdfStyles.subheading}>Exercise</Text>
          {healthAdvice[result.message as ResultType].exercise.map((tip, i) => (
            <Text key={i} style={pdfStyles.field}>
              • {tip}
            </Text>
          ))}

          <Text style={pdfStyles.subheading}>Lifestyle</Text>
          {healthAdvice[result.message as ResultType].lifestyle.map(
            (tip, i) => (
              <Text key={i} style={pdfStyles.field}>
                • {tip}
              </Text>
            )
          )}
        </View>
      )}
      <View>
        <Text style={pdfStyles.subheading}>Medical Disclaimer</Text>

        <Text
          style={{
            color: "gray",
            fontSize: 9,
            lineHeight: 1.5,
            marginBottom: 5,
          }}
        >
          This tool is for informational and educational purposes only and does
          not constitute medical advice. Please consult with a healthcare
          professional for proper diagnosis and treatment.
        </Text>
      </View>
    </Page>
  </Document>
);

export default ResultPDF;
