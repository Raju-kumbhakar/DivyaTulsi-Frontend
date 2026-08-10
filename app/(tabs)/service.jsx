// Service.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  Alert,
  Linking,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const MEDS_KEY = "@service_meds";

const { width } = Dimensions.get("window");
const TILE_SIZE = (width - 48) / 2; 

export default function Service() {
  
  const [hospitals, setHospitals] = useState([
    {
      id: "h1",
      name: "Aarogyam Hospital",
      address: "Bhagwanpur, Uttarakhand 247661 ",
      phone: "7533920244",
      distanceKm: 4.2,
      services:["Emergency", "Inpatient", "Ambulance"],
      lat: 29.92297, 
      lng: 77.830523,
    },
    {
      id: "h2",
      name: "Jeevan Jyoti Hospital",
      address: "khasra, Saharanpur,247001",
      phone: "9897751511",
      distanceKm: 8.5,
      services: ["General OPD", "Maternal Care", "First Aid"],
      lat: 30.036147,
      lng:  77.75138,
    },
     {
      id: "h3",
      name: "Roorkee Hospital",
      address: "Labour Chowk, Roorkee 247667",
      phone: "9411195083",
      distanceKm: 6.7,
      services: ["General OPD","First Aid", "surgery"],
      lat: 29.87,
      lng:  77.87,
    },
  ]);
  const [selectedHospital, setSelectedHospital] = useState(null);

 
  const [doctors, setDoctors] = useState([
    { id: "d1", name: "Dr. Raina Sharma", speciality: "General Physician", phone: "7668352619", availability: "9am - 1pm" },
    { id: "d2", name: "Dr. Nishant", speciality: "Pediatrics", phone: "7982512360", availability: "3pm - 7pm" },
    { id: "d3", name: "Dr. Raju K", speciality: "Dentist", phone: "9798037778", availability: "10pm - 6pm" },
    { id: "d4", name: "Dr. Priyanshu Rajput", speciality: "Neurologist", phone: "7300623532", availability: "9pm - 2pm" },
    { id: "d5", name: "Dr. Pratiksha Raj", speciality: "orthopedics", phone: "7982512360", availability: "3pm - 8pm" },
  ]);

  
  const ambulanceNumbers = [
    { name: "State Ambulance (108)", phone: "108" },
    { name: "Local Private Ambulance", phone: "7982512360" },
  ];

  
  const [meds, setMeds] = useState([]);
  const [newMedName, setNewMedName] = useState("");
  const [newMedTime, setNewMedTime] = useState("");

  
  const tileAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadMeds();
    // entrance animation
    Animated.timing(tileAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, []);

  async function loadMeds() {
    try {
      const raw = await AsyncStorage.getItem(MEDS_KEY);
      if (raw) setMeds(JSON.parse(raw));
    } catch (e) {
      console.warn("Failed to load meds", e);
    }
  }

  async function saveMeds(next) {
    try {
      await AsyncStorage.setItem(MEDS_KEY, JSON.stringify(next));
    } catch (e) {
      console.warn("Failed to save meds", e);
    }
  }

  function addMed() {
    if (!newMedName.trim() || !newMedTime.trim()) {
      Alert.alert("Enter medicine name and time");
      return;
    }
    const medicine = {
      id: Date.now().toString(),
      name: newMedName.trim(),
      time: newMedTime.trim(),
    };
    const updated = [...meds, medicine];
    setMeds(updated);
    saveMeds(updated);
    setNewMedName("");
    setNewMedTime("");
  }

  function removeMed(id) {
    const updated = meds.filter((m) => m.id !== id);
    setMeds(updated);
    saveMeds(updated);
  }

  // ---- Calling & Maps ----
  function openDial(phone) {
    const url = `tel:${phone}`;
    Linking.openURL(url).catch(() => Alert.alert("Could not open phone app"));
  }

  function openSms(phone, body = "") {
    const sep = Platform.OS === "ios" ? "&" : "?";
    const url = `sms:${phone}${sep}body=${encodeURIComponent(body)}`;
    Linking.openURL(url).catch(() => Alert.alert("Could not open SMS app"));
  }

  function openMaps(lat, lng, label) {
    const url =
      Platform.OS === "ios"
        ? `maps:0,0?q=${lat},${lng}(${label})`
        : `geo:${lat},${lng}?q=${label}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
    });
  }

  function openNearbyHospitals() {
    Linking.openURL("https://www.google.com/maps/search/hospitals+near+me");
  }

   function openNearbyMedicals() {
    Linking.openURL("https://www.google.com/maps/search/medicals+near+me");
  }

  function contactDoctor(doctor) {
    Alert.alert(
      doctor.name,
      `Speciality: ${doctor.speciality}\nAvailability: ${doctor.availability}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call", onPress: () => openDial(doctor.phone) },
        { text: "Message", onPress: () => openSms(doctor.phone, `Hello ${doctor.name}, I need consultation.`) },
      ]
    );
  }

  function callAmbulance(number) {
    Alert.alert("Call Ambulance", `Call ${number}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Call", onPress: () => openDial(number) },
    ]);
  }


  const tileTranslate = tileAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });
  const tileOpacity = tileAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });


  const tiles = [
    { id: "t1", name: "Hospitals", icon: <FontAwesome5 name="hospital" size={22} color="#fff" />, action: () => scrollToSection("hospitals") },
    { id: "t2", name: "Doctors", icon: <MaterialCommunityIcons name="doctor" size={22} color="#fff" />, action: () => scrollToSection("doctors") },
    { id: "t3", name: "Ambulance", icon: <FontAwesome5 name="ambulance" size={22} color="#fff" />, action: () => scrollToSection("ambulance") },
    { id: "t4", name: "Medicals Nearby", icon: <Ionicons name="medkit" size={22} color="#fff" />, action:openNearbyMedicals },
    { id: "t5", name: "Chat", icon: <Ionicons name="chatbubbles" size={22} color="#fff" />, action: () => router.push("/pages/chat") },
    { id: "t6", name: "Nearby", icon: <Ionicons name="location" size={22} color="#fff" />, action: openNearbyHospitals },
  ];


  const scrollRef = useRef(null);
  const sectionPositions = useRef({});

  function registerSection(key, y) {
    sectionPositions.current[key] = y;
  }

  function scrollToSection(key) {
    const y = sectionPositions.current[key] || 0;
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: y - 10, animated: true });
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <LinearGradient colors={["#4DA9FF", "#0066CC"]} start={[0, 0]} end={[1, 1]} style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.appTitle}>Health Hub</Text>
          <Text style={styles.appSubtitle}>Quick access to healthcare services</Text>
        </View>

        <TouchableOpacity style={styles.emergencyBtn} activeOpacity={0.8} onPress={() => callAmbulance("108")}>
          <Ionicons name="alert-circle" size={20} color="#fff" />
          <Text style={styles.emergencyText}>Emergency</Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 16 }}
      >
        {/* Dashboard Tiles */}
        <View style={styles.tilesContainer}>
          {tiles.map((tile, i) => (
            <Animated.View
              key={tile.id}
              style={[
                styles.tile,
                {
                  transform: [{ translateY: tileTranslate }],
                  opacity: tileOpacity,
                },
              ]}
            >
              <TouchableOpacity style={styles.tileInner} activeOpacity={0.8} onPress={tile.action}>
                <View style={styles.tileIcon}>{tile.icon}</View>
                <Text style={styles.tileText}>{tile.name}</Text>
                <Ionicons name="chevron-forward" size={18} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Nearby Hospitals Section */}
        <View
          style={styles.section}
          onLayout={(e) => registerSection("hospitals", e.nativeEvent.layout.y)}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Hospital Locator</Text>
            <View style={styles.sectionActions}>
              <TouchableOpacity style={styles.iconBtn} onPress={openNearbyHospitals}>
                <Ionicons name="map" size={18} color="#0066CC" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconBtn, { marginLeft: 8 }]} onPress={() => Alert.alert("Info", "Tap any hospital to view details.")}>
                <Ionicons name="information-circle" size={18} color="#0066CC" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardSubtitle}>Find the nearest hospitals instantly.</Text>
            <TouchableOpacity style={styles.callToAction} onPress={openNearbyHospitals} activeOpacity={0.85}>
              <Ionicons name="location" size={18} color="#0066CC" />
              <Text style={styles.ctaText}>Open Hospitals Near Me</Text>
            </TouchableOpacity>
          </View>
        </View>

   
        <View
          style={styles.section}
          onLayout={(e) => registerSection("hospitalsList", e.nativeEvent.layout.y)}
        >
          <Text style={styles.sectionTitle}>Nearby Hospitals (Offline List)</Text>
          <View style={{ height: 8 }} />

          <FlatList
            data={hospitals}
            keyExtractor={(h) => h.id}
            contentContainerStyle={{ paddingBottom: 4 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedHospital(item)}
                style={styles.hospitalRow}
                activeOpacity={0.8}
              >
                <View style={styles.hospitalLeft}>
                  <FontAwesome5 name="hospital" size={28} color="#0066CC" />
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={styles.hospitalTitle}>{item.name}</Text>
                    <Text style={styles.hospitalMeta}>{item.address} • {item.distanceKm} km</Text>
                  </View>
                </View>

                <View style={styles.hospitalActions}>
                  <TouchableOpacity style={styles.pillBtn} onPress={() => openDial(item.phone)}>
                    <Ionicons name="call" size={14} color="#fff" />
                    <Text style={styles.pillText}>Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.pillBtn, { backgroundColor: "#0ea5a4", marginTop: 8 }]} onPress={() => openMaps(item.lat, item.lng, item.name)}>
                    <Ionicons name="map" size={14} color="#fff" />
                    <Text style={styles.pillText}>Map</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
            scrollEnabled={false}  
          />

          {selectedHospital && (
            <View style={styles.detailBox}>
              <Text style={styles.detailTitle}>{selectedHospital.name}</Text>
              <Text style={styles.small}>{selectedHospital.address}</Text>
              <Text style={styles.small}>Phone: {selectedHospital.phone}</Text>
              <Text style={styles.small}>Services: {selectedHospital.services.join(", ")}</Text>

              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <TouchableOpacity style={styles.btnSecondary} onPress={() => openDial(selectedHospital.phone)}>
                  <Text style={styles.btnText}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.btnSecondary, { marginLeft: 8 }]} onPress={() => openSms(selectedHospital.phone, "I need medical help")}>
                  <Text style={styles.btnText}>Message</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.btnSecondary, { marginLeft: 8 }]} onPress={() => openMaps(selectedHospital.lat, selectedHospital.lng, selectedHospital.name)}>
                  <Text style={styles.btnText}>Map</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Doctors */}
        <View style={styles.section} onLayout={(e) => registerSection("doctors", e.nativeEvent.layout.y)}>
          <Text style={styles.sectionTitle}>Doctors Directory</Text>
          <View style={{ height: 8 }} />

          <View style={styles.card}>
            {doctors.map((doc) => (
              <View key={doc.id} style={styles.doctorRow}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialCommunityIcons name="account-heart" size={28} color="#0066CC" />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.hospitalTitle}>{doc.name}</Text>
                    <Text style={styles.hospitalMeta}>{doc.speciality} • {doc.availability}</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.pillBtn} onPress={() => contactDoctor(doc)}>
                  <Ionicons name="call" size={14} color="#fff" />
                  <Text style={styles.pillText}>Contact</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Ambulance */}
        <View style={styles.section} onLayout={(e) => registerSection("ambulance", e.nativeEvent.layout.y)}>
          <Text style={styles.sectionTitle}>Ambulance Services</Text>
          <View style={{ height: 8 }} />

          <View style={styles.card}>
            {ambulanceNumbers.map((a) => (
              <View key={a.phone} style={styles.doctorRow}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome5 name="ambulance" size={28} color="#b91c1c" />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.hospitalTitle}>{a.name}</Text>
                    <Text style={styles.hospitalMeta}>Phone: {a.phone}</Text>
                  </View>
                </View>

                <View>
                  <TouchableOpacity style={[styles.pillBtn, { backgroundColor: "#b91c1c" }]} onPress={() => callAmbulance(a.phone)}>
                    <Ionicons name="call" size={14} color="#fff" />
                    <Text style={styles.pillText}>Call</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.pillBtn, { backgroundColor: "#f97316", marginTop: 8 }]} onPress={() => openSms(a.phone, "Need ambulance at my location, urgent.")}>
                    <Ionicons name="chatbubbles" size={14} color="#fff" />
                    <Text style={styles.pillText}>SMS</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Medicines */}
        <View style={styles.section} onLayout={(e) => registerSection("meds", e.nativeEvent.layout.y)}>
          <Text style={styles.sectionTitle}>Medicine Reminders</Text>
          <View style={{ height: 8 }} />

          <View style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <TextInput
                placeholder="Medicine name"
                style={[styles.input, { width: '46%' }]}
                value={newMedName}
                onChangeText={setNewMedName}
              />

              <TextInput
                placeholder="Time (e.g., 08:00 AM)"
                style={[styles.input, { width: '50%' }]}
                value={newMedTime}
                onChangeText={setNewMedTime}
              />
            </View>

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <TouchableOpacity style={styles.btnPrimary} onPress={addMed}>
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={[styles.btnText, { marginLeft: 8 }]}>Add Reminder</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btnSecondary, { marginLeft: 10 }]}
                onPress={() => Alert.alert("Download", "Report download not implemented in demo.")}
              >
                <Ionicons name="download" size={16} color="#fff" />
                <Text style={[styles.btnText, { marginLeft: 8 }]}>Download Report</Text>
              </TouchableOpacity>
            </View>

            {meds.length === 0 ? (
              <Text style={[styles.small, { marginTop: 12 }]}>No reminders added.</Text>
            ) : (
              <View style={{ marginTop: 12 }}>
                {meds.map((m) => (
                  <View key={m.id} style={styles.medRow}>
                    <View>
                      <Text style={styles.hospitalTitle}>{m.name}</Text>
                      <Text style={styles.hospitalMeta}>Time: {m.time}</Text>
                    </View>
                    <TouchableOpacity style={styles.removeBtn} onPress={() => removeMed(m.id)}>
                      <Ionicons name="trash" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={{ height: 28 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fb",
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A90E2",
    padding: 15,
    gap: 10,
  },
  headerLeft: {},
  appTitle: { color: "#fff", fontSize: 22, fontWeight: "800" },
  appSubtitle: { color: "#e6f4ff", fontSize: 13, marginTop: 4 },

  emergencyBtn: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  emergencyText: { color: "#fff", fontWeight: "800", marginLeft: 8 },

  // tiles
  tilesContainer: {
    paddingHorizontal: 4,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  tile: {
    width: TILE_SIZE,
    marginBottom: 12,
  },
  tileInner: {
    backgroundColor: "#0066CC",
    borderRadius: 14,
    padding: 14,
    height: TILE_SIZE * 0.8,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  tileIcon: {
    backgroundColor: "rgba(255,255,255,0.12)",
    padding: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  tileText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 8,
  },

  section: { marginBottom: 14 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: { color: "#0f172a", fontSize: 16, fontWeight: "800" },
  sectionActions: { flexDirection: "row" },

  card: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
  },

  cardSubtitle: { color: "#374151", fontSize: 13, marginBottom: 8 },

  callToAction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f4ff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  ctaText: { color: "#0066CC", fontWeight: "800", marginLeft: 10 },

  hospitalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  hospitalLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  hospitalTitle: { color: "#0f172a", fontWeight: "800", fontSize: 14 },
  hospitalMeta: { color: "#6b7280", fontSize: 12, marginTop: 2 },

  hospitalActions: { alignItems: "flex-end", marginLeft: 10 },

  pillBtn: {
    backgroundColor: "#0066CC",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  pillText: { color: "#fff", fontSize: 12, fontWeight: "700", marginLeft: 6 },

  detailBox: {
    marginTop: 10,
    backgroundColor: "#f7fbff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e6f4ff",
  },

  detailTitle: { fontWeight: "900", color: "#0f172a", fontSize: 15 },

  small: { fontSize: 12, color: "#6b7280" },

  doctorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomColor: "#f1f5f9",
    borderBottomWidth: 1,
  },

  // buttons
  btnPrimary: {
    backgroundColor: "#0066CC",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnSecondary: {
    backgroundColor: "#4b5563",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { color: "#fff", fontWeight: "800", fontSize: 12 },

  input: {
    borderWidth: 0,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    fontSize: 14,
    color: "#0f172a",
    borderColor: "#e6eefc",
  },

  medRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: "#f1f5f9",
    borderBottomWidth: 1,
  },

  removeBtn: {
    backgroundColor: "#ef4444",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});