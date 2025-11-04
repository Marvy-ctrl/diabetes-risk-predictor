"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

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
  heading: { fontSize: 14, marginBottom: 10, fontWeight: "bold" },
  field: { fontSize: 11, marginBottom: 5 },
});

interface ResultPDFProps {
  values: any;
  result: any;
}

const ResultPDF: React.FC<ResultPDFProps> = ({ values, result }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.heading}>
        <Image src="frontend/public/activity.png" style={pdfStyles.logoIcon} />
        <Text style={pdfStyles.appName}>GlucoSense</Text>
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
    </Page>
  </Document>
);

export default ResultPDF;
