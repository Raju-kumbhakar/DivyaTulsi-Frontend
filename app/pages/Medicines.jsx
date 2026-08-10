import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "http://172.168.17.209:8080/api/medicine/chat";

// Common diseases and their medicines
const commonDiseases = [
  {
    disease: "Headache",
    medicines: ["Paracetamol", "Ibuprofen", "Aspirin", "Naproxen"]
  },
  {
    disease: "Fever",
    medicines: ["Paracetamol", "Ibuprofen", "Acetaminophen", "Mefenamic Acid"]
  },
  {
    disease: "Cold & Cough",
    medicines: ["Cetirizine", "Diphenhydramine", "Dextromethorphan", "Guaifenesin"]
  },
  {
    disease: "Stomach Pain",
    medicines: ["Antacid", "Omeprazole", "Ranitidine", "Dicyclomine"]
  },
  {
    disease: "Acidity",
    medicines: ["Pantoprazole", "Ranitidine", "Antacid", "Omeprazole"]
  },
  {
    disease: "Allergy",
    medicines: ["Cetirizine", "Loratadine", "Fexofenadine", "Chlorpheniramine"]
  },
  {
    disease: "Body Pain",
    medicines: ["Ibuprofen", "Diclofenac", "Naproxen", "Paracetamol"]
  },
  {
    disease: "Diarrhea",
    medicines: ["Loperamide", "ORS", "Racecadotril", "Metronidazole"]
  },
  {
    disease: "Constipation",
    medicines: ["Psyllium Husk", "Lactulose", "Bisacodyl", "Dulcolax"]
  },
  {
    disease: "Vomiting",
    medicines: ["Domperidone", "Ondansetron", "Metoclopramide", "Emeset"]
  },
  {
    disease: "Infection",
    medicines: ["Amoxicillin", "Azithromycin", "Ciprofloxacin", "Doxycycline"]
  },
  {
    disease: "Asthma",
    medicines: ["Salbutamol", "Montelukast", "Budesonide", "Theophylline"]
  },
  {
    disease: "Diabetes",
    medicines: ["Metformin", "Glibenclamide", "Insulin", "Glimepiride"]
  },
  {
    disease: "High BP",
    medicines: ["Amlodipine", "Losartan", "Atenolol", "Hydrochlorothiazide"]
  },
  {
    disease: "Anxiety",
    medicines: ["Alprazolam", "Diazepam", "Lorazepam", "Clonazepam"]
  },
  {
    disease: "Depression",
    medicines: ["Sertraline", "Fluoxetine", "Escitalopram", "Venlafaxine"]
  },
  {
    disease: "Skin Rash",
    medicines: ["Hydrocortisone", "Cetirizine", "Calamine", "Betamethasone"]
  },
  {
    disease: "Eye Infection",
    medicines: ["Tobramycin", "Ciprofloxacin", "Ofloxacin", "Moxifloxacin"]
  },
  {
    disease: "Ear Pain",
    medicines: ["Amoxicillin", "Ciprofloxacin", "Ibuprofen", "Paracetamol"]
  },
  {
    disease: "Toothache",
    medicines: ["Ibuprofen", "Paracetamol", "Diclofenac", "Amoxicillin"]
  }
];

export default function Medicines() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResult({});
    Keyboard.dismiss();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      if (data.success) {
        const sections = {};
        data.data.split("\n").forEach((line) => {
          const [key, value] = line.split(":");
          if (key && value) sections[key.trim()] = value.trim();
        });
        setResult(sections);
      } else {
        setResult({ Error: data.message || "Failed to fetch medicine details." });
      }
    } catch (err) {
      console.error("Medicine API Error:", err);
      setResult({ Error: "❌ Failed to fetch medicine details. Check server." });
    }

    setLoading(false);
  };

  const handleMedicineClick = (medicineName) => {
    setQuery(medicineName);
    handleSearch();
  };

  const clearSearch = () => {
    setQuery("");
    setResult({});
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>MediGuide</Text>
        <Ionicons name="medical-outline" size={32} color="#fff" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={22} color="#4A90E2" />
          <TextInput
            style={styles.input}
            placeholder="Search medicine..."
            placeholderTextColor="#7DA7D9"
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Button */}
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>

        {/* Loading */}
        {loading && <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 20 }} />}

        {/* Show Common Diseases only when no results */}
        {Object.keys(result).length === 0 && !loading && (
          <View style={styles.diseasesContainer}>
            <Text style={styles.diseasesTitle}>Common Diseases & Medicines</Text>
            <Text style={styles.diseasesSubtitle}>Tap on any medicine to search</Text>
            
            {commonDiseases.map((disease, index) => (
              <View key={index} style={styles.diseaseCard}>
                <Text style={styles.diseaseName}>{disease.disease}</Text>
                <View style={styles.medicinesContainer}>
                  {disease.medicines.map((medicine, medIndex) => (
                    <TouchableOpacity
                      key={medIndex}
                      style={styles.medicineButton}
                      onPress={() => handleMedicineClick(medicine)}
                    >
                      <Text style={styles.medicineText}>{medicine}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Result Box - Show only when there are results */}
        {Object.keys(result).length > 0 && (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Search Results</Text>
              <TouchableOpacity onPress={clearSearch} style={styles.backButton}>
                <Ionicons name="arrow-back" size={20} color="#4A90E2" />
                <Text style={styles.backButtonText}>Back to List</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.resultCard}>
              {Object.entries(result).map(([key, value], idx) => (
                <View key={idx} style={{ marginBottom: 10 }}>
                  <Text style={styles.resultKey}>{key}:</Text>
                  <Text style={styles.resultValue}>{value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E6F0FA" },

  header: {
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: { fontSize: 22, fontWeight: "700", color: "#fff" },

  scrollContent: { padding: 20 },

  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#4A90E2",
  },

  input: { flex: 1, marginLeft: 10, fontSize: 16, color: "#4A90E2", fontWeight: "500" },

  button: { backgroundColor: "#4A90E2", paddingVertical: 12, borderRadius: 12, marginTop: 15, elevation: 3 },

  buttonText: { color: "#fff", textAlign: "center", fontSize: 17, fontWeight: "600" },

  diseasesContainer: {
    marginTop: 30,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 18,
    elevation: 3,
  },

  diseasesTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4A90E2",
    marginBottom: 5,
  },

  diseasesSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    fontStyle: "italic",
  },

  diseaseCard: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  diseaseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },

  medicinesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  medicineButton: {
    backgroundColor: "#E6F0FA",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4A90E2",
  },

  medicineText: {
    fontSize: 14,
    color: "#4A90E2",
    fontWeight: "500",
  },

  resultContainer: {
    marginTop: 20,
  },

  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4A90E2",
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  backButtonText: {
    color: "#4A90E2",
    fontWeight: "500",
  },

  resultCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 15,
    elevation: 3,
    borderLeftWidth: 5,
    borderColor: "#4A90E2"
  },

  resultKey: { fontSize: 15, fontWeight: "700", color: "#4A90E2" },

  resultValue: { fontSize: 15, color: "#333", lineHeight: 22 },
});