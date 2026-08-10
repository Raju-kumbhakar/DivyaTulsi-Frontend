import React, { useEffect, useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  ActivityIndicator, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-gifted-charts";
import { theme } from "../../constants/theme";
import { hp, wp } from "../../helpers/common";

const HealthInsights = () => {
  const [userId, setUserId] = useState(null);
  const [heartRate, setHeartRate] = useState([]);
  const [bpSys, setBpSys] = useState([]);
  const [bpDia, setBpDia] = useState([]);
  const [sugar, setSugar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Date selection state
  const [selectedDate, setSelectedDate] = useState(getCurrentDate()); // Default to today
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date()); // State for auto-updating date

  // Form fields
  const [form, setForm] = useState({
    systolic: "",
    diastolic: "",
    sugarLevel: "",
    heartRate: "",
  });

  // Base URL
  const BASE_URL = "http://172.168.17.209:8080";

  // Helper function to get current date in YYYY-MM-DD format
  function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Helper function to get current time in HH:MM:SS format
  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  // Load user ID first
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await AsyncStorage.getItem("user");
        if (data) {
          const parsed = JSON.parse(data);
          setUserId(parsed.id);
          console.log("User ID loaded:", parsed.id);
        } else {
          Alert.alert("Error", "User not found. Please login again.");
        }
      } catch (error) {
        console.log("Error loading user:", error);
        Alert.alert("Error", "Failed to load user data");
      }
    };
    loadUser();
  }, []);

  // Fetch data when userId is ready
  useEffect(() => {
    if (userId) {
      console.log("Fetching data for user:", userId);
      fetchData();
    }
  }, [userId]);

  // Auto-update date every second for real-time accuracy
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); // Update every second for better accuracy

    return () => clearInterval(interval);
  }, []);

  // Format date for display
  const formatDisplayDate = (date) => {
    try {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC' // Use UTC to avoid timezone issues
      });
    } catch (error) {
      console.log("Date formatting error:", error);
      return "Loading date...";
    }
  };

  // Format time for display
  const formatTime = (date) => {
    try {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'UTC'
      });
    } catch (error) {
      console.log("Time formatting error:", error);
      return "Loading time...";
    }
  };

  // Get today's date for form submission
  const getTodaysDate = () => {
    return getCurrentDate();
  };

  const fetchData = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      console.log("Starting API calls...");
      
      const [sugarRes, hrRes, bpRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/health/sugar/last7days/${userId}`),
        axios.get(`${BASE_URL}/api/health/hr/last7days/${userId}`),
        axios.get(`${BASE_URL}/api/health/bp/last7days/${userId}`)
      ]);

      console.log("API responses received");
      
      setSugar(sugarRes.data.map((d) => ({ value: d.sugarLevel, label: d.date })));
      setHeartRate(hrRes.data.map((d) => ({ value: d.heartRate, label: d.date })));
      setBpSys(bpRes.data.map((d) => ({ value: d.systolic, label: d.date })));
      setBpDia(bpRes.data.map((d) => ({ value: d.diastolic, label: d.date })));
      
    } catch (err) {
      console.log("Fetch error:", err.response?.data || err.message);
      Alert.alert("Error", `Failed to load health data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Validate date format (YYYY-MM-DD)
  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    try {
      const date = new Date(dateString);
      return date instanceof Date && !isNaN(date);
    } catch (error) {
      return false;
    }
  };

  const submitHealthData = async () => {
    // Validation
    if (!userId) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    if (!form.systolic || !form.diastolic || !form.sugarLevel || !form.heartRate) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    // Date validation
    if (useCustomDate && !isValidDate(selectedDate)) {
      Alert.alert("Error", "Please enter a valid date in YYYY-MM-DD format");
      return;
    }

    // Number validation
    const systolic = Number(form.systolic);
    const diastolic = Number(form.diastolic);
    const sugarLevel = Number(form.sugarLevel);
    const heartRateValue = Number(form.heartRate);

    if (isNaN(systolic) || isNaN(diastolic) || isNaN(sugarLevel) || isNaN(heartRateValue)) {
      Alert.alert("Error", "Please enter valid numbers");
      return;
    }

    setSubmitting(true);

    try {
      const dateParam = useCustomDate ? selectedDate : getTodaysDate();
      console.log("Submitting data for user:", userId, "Date:", dateParam);
      
      // Use the new API with date parameter
      const response = await axios.post(
        `${BASE_URL}/api/health/add/${userId}?date=${dateParam}`, 
        {
          systolic: systolic,
          diastolic: diastolic,
          sugarLevel: sugarLevel,
          heartRate: heartRateValue,
        }
      );

      console.log("Response:", response.data);
      
      Alert.alert("Success", `Health data added for ${dateParam}!`);
      setForm({ systolic: "", diastolic: "", sugarLevel: "", heartRate: "" });
      setUseCustomDate(false);
      setSelectedDate(getCurrentDate());
      
      // Refresh data
      fetchData();

    } catch (error) {
      console.log("Submit error details:");
      console.log("Error message:", error.message);
      console.log("Error response:", error.response?.data);
      console.log("Error status:", error.response?.status);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || "Failed to save data";
        Alert.alert("Server Error", errorMessage);
      } else if (error.request) {
        Alert.alert("Network Error", "Cannot connect to server.");
      } else {
        Alert.alert("Error", "Failed to send data");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const toggleDateSelection = () => {
    setUseCustomDate(!useCustomDate);
  };

  if (!userId) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>Loading user data...</Text>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 50 }} />
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>Loading health data for user {userId}...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Health Insights</Text>
        <Ionicons name="analytics-outline" size={34} color="#fff" />
      </View>

      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* MAIN CARD - Removed date display from here */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Health Dashboard</Text>
            <Text style={styles.cardSubtitle}>Your real-time health visualization</Text>
            <Text style={styles.userInfo}>User ID: {userId}</Text>
          </View>

          {/* CHARTS */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>❤️ Heart Rate (BPM)</Text>
            {heartRate.length > 0 ? (
              <LineChart
                data={heartRate}
                curved
                thickness={4}
                color="#FF3B30"
                spacing={40}
                areaChart
                startFillColor="rgba(255,59,48,0.25)"
                endFillColor="rgba(255,59,48,0.05)"
                isAnimated
              />
            ) : (
              <Text style={styles.noData}>No heart rate data available</Text>
            )}
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>💙 Blood Pressure (Sys / Dia)</Text>
            {bpSys.length > 0 ? (
              <LineChart
                data={bpSys}
                data2={bpDia}
                thickness={3}
                color1="#3B82F6"
                color2="#10B981"
                spacing={40}
                isAnimated
              />
            ) : (
              <Text style={styles.noData}>No blood pressure data available</Text>
            )}
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>🍬 Blood Sugar (mg/dL)</Text>
            {sugar.length > 0 ? (
              <LineChart
                data={sugar}
                curved
                thickness={4}
                color="#A855F7"
                spacing={40}
                areaChart
                startFillColor="rgba(168,85,247,0.25)"
                endFillColor="rgba(168,85,247,0.07)"
                isAnimated
              />
            ) : (
              <Text style={styles.noData}>No blood sugar data available</Text>
            )}
          </View>

          {/* UPDATED FORM WITH SIMPLE DATE INPUT */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>➕ Add New Health Data</Text>

            {/* Simple Date Selection */}
            <View style={styles.dateSection}>
              <TouchableOpacity 
                style={styles.dateToggle}
                onPress={toggleDateSelection}
              >
                <Ionicons 
                  name={useCustomDate ? "calendar" : "calendar-outline"} 
                  size={20} 
                  color={theme.colors.primary} 
                />
                <Text style={styles.dateToggleText}>
                  {useCustomDate ? "Using Custom Date" : "Using Today's Date"}
                </Text>
              </TouchableOpacity>
              
              {useCustomDate && (
                <View>
                  <Text style={styles.dateLabel}>Enter Date (YYYY-MM-DD):</Text>
                  <TextInput
                    style={styles.dateInput}
                    placeholder={getCurrentDate()}
                    value={selectedDate}
                    onChangeText={setSelectedDate}
                    keyboardType="numbers-and-punctuation"
                  />
                  <Text style={styles.dateHint}>Format: YYYY-MM-DD (e.g., {getCurrentDate()})</Text>
                </View>
              )}
              
              <Text style={styles.currentDate}>
                Submitting for: <Text style={styles.dateValue}>
                  {useCustomDate ? selectedDate : getTodaysDate()}
                </Text>
              </Text>
            </View>

            {/* Health Data Inputs */}
            <TextInput
              style={styles.input}
              placeholder="Systolic (e.g., 118)"
              keyboardType="numeric"
              value={form.systolic}
              onChangeText={(text) => setForm({ ...form, systolic: text })}
              returnKeyType="next"
            />

            <TextInput
              style={styles.input}
              placeholder="Diastolic (e.g., 82)"
              keyboardType="numeric"
              value={form.diastolic}
              onChangeText={(text) => setForm({ ...form, diastolic: text })}
              returnKeyType="next"
            />

            <TextInput
              style={styles.input}
              placeholder="Sugar Level (e.g., 105)"
              keyboardType="numeric"
              value={form.sugarLevel}
              onChangeText={(text) => setForm({ ...form, sugarLevel: text })}
              returnKeyType="next"
            />

            <TextInput
              style={styles.input}
              placeholder="Heart Rate (e.g., 76)"
              keyboardType="numeric"
              value={form.heartRate}
              onChangeText={(text) => setForm({ ...form, heartRate: text })}
              returnKeyType="done"
              onSubmitEditing={submitHealthData}
            />

            <TouchableOpacity 
              style={[styles.button, submitting && styles.buttonDisabled]} 
              onPress={submitHealthData}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  Submit for {useCustomDate ? selectedDate : "Today"}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* AUTO-UPDATING DATE AT BOTTOM - Now in two lines */}
          <View style={styles.dateFooter}>
            <View style={styles.dateFooterRow}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.dateFooterText}>
                Last updated: {formatTime(currentDate)}
              </Text>
            </View>
            <View style={styles.dateFooterRow}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.dateFooterText}>
                {formatDisplayDate(currentDate)}
              </Text>
            </View>
          </View>

          {/* Extra space for keyboard */}
          <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HealthInsights;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgLight,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  title: {
    fontSize: hp(3),
    color: "#fff",
    fontWeight: "bold",
  },
  scrollContent: {
    padding: wp(4),
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: hp(2.6),
    fontWeight: "700",
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: hp(1.6),
    color: '#666',
  },
  userInfo: {
    marginTop: 8,
    fontSize: hp(1.4),
    color: '#888',
    fontStyle: 'italic',
  },
  // Removed currentDateDisplay styles
  chartCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: hp(2),
    fontWeight: "600",
    marginBottom: 10,
  },
  noData: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  formCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
  },
  formTitle: {
    fontSize: hp(2.2),
    fontWeight: "700",
    marginBottom: 10,
  },
  dateSection: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  dateToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  dateToggleText: {
    marginLeft: 8,
    fontSize: hp(1.6),
    color: theme.colors.primary,
    fontWeight: '500',
  },
  dateLabel: {
    fontSize: hp(1.6),
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    color: '#333',
  },
  dateInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: hp(1.6),
  },
  dateHint: {
    fontSize: hp(1.4),
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
  currentDate: {
    marginTop: 8,
    fontSize: hp(1.5),
    color: '#333',
    fontWeight: '500',
  },
  dateValue: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: hp(1.8),
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: hp(1.8),
  },
  // New styles for auto-updating date footer
  dateFooter: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginTop: 10,
  },
  dateFooterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  dateFooterText: {
    marginLeft: 6,
    fontSize: hp(1.4),
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
});