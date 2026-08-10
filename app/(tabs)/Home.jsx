import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView edges={['left','right','bottom']} style={styles.container}>


      <View style={styles.header}>
        <Text style={styles.appName}>DivyaTulsi</Text>

        <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
          <Ionicons name="person-circle-outline" size={40} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

    
        <View style={styles.heroCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Welcome Back!</Text>
            <Text style={styles.heroText}>
              Your smart health assistant is ready to guide you.
            </Text>
          </View>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/4320/4320337.png" }}
            style={styles.heroImage}
          />
        </View>

        
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.grid}>
          <FeatureButton
            icon="pulse-outline"
            label="Track Health"
            onPress={() => router.push("/pages/schemesList")}
            colors={["#4A90E2", "#6BB8FF"]}
          />
          <FeatureButton
            icon="medkit-outline"
            label="MediGuide"
            onPress={() => router.push("/pages/Medicines")}
            colors={["#10B981", "#4ADE80"]}
          />
          <FeatureButton
            icon="compass-outline"
            label="Explore"
            onPress={() => router.push("/pages/explore")}
            colors={["#A855F7", "#C084FC"]}
          />
          <FeatureButton
            icon="help-circle-outline"
            label="Help"
            onPress={() => router.push("/pages/help")}
            colors={["#F59E0B", "#FBBF24"]}
          />
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={26} color="#4A90E2" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.infoTitle}>Did You Know?</Text>
            <Text style={styles.infoText}>
              You can track all health metrics in one place using our dashboard.
            </Text>
          </View>
        </View>

      </ScrollView>

    </SafeAreaView>
  );
};

function FeatureButton({ icon, label, onPress, colors }) {
  return (
    <TouchableOpacity
      style={[styles.featureBtn, { backgroundColor: colors[0] }]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.featureIconContainer}>
        <Ionicons name={icon} size={30} color="#fff" />
      </View>
      <Text style={styles.featureLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F7FF",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#4A90E2",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 6,
  
  },

  appName: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
  },

  scroll: {
    padding: 20,
  },

  heroCard: {
    flexDirection: "row",
    backgroundColor: "#4A90E2",
    padding: 20,
    borderRadius: 22,
    alignItems: "center",
    elevation: 4,
  },

  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },

  heroText: {
    fontSize: 14,
    color: "#E8F1FF",
    marginTop: 4,
  },

  heroImage: {
    width: 95,
    height: 95,
  },

  sectionTitle: {
    marginTop: 25,
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 15,
  },

  featureBtn: {
    width: "47%",
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginBottom: 18,
    elevation: 4,
  },

  featureIconContainer: {
    backgroundColor: "rgba(255,255,255,0.25)",
    padding: 12,
    borderRadius: 50,
    alignSelf: "flex-start",
  },

  featureLabel: {
    marginTop: 15,
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },

  infoCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    elevation: 3,
    marginTop: 20,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4A90E2",
  },

  infoText: {
    fontSize: 14,
    color: "#444",
    marginTop: 3,
  },
});

export default HomeScreen;
