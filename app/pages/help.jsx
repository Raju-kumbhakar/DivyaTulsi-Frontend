import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, Alert } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const Help = () => {
  const [expandedTopic, setExpandedTopic] = useState(null);

  const toggleTopic = (topic) => {
    setExpandedTopic(expandedTopic === topic ? null : topic);
  };

  const handleEmailUs = async () => {
    const email = 'bhardwajnishant138@gmail.com';
    const subject = 'Support Request - Health App';
    const body = 'Hello, I need help with:';
    
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to open email app');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open email app');
      console.error('Email error:', error);
    }
  };

  const helpTopics = [
    {
      id: "track-health",
      icon: "information-circle-outline",
      title: "How to track your health?",
      content: "• Use the Health Dashboard to monitor your vital signs\n• Record daily symptoms and mood\n• Set reminders for medication and appointments\n• Track your exercise and nutrition habits\n• View progress charts and trends over time"
    },
    {
      id: "medical-terms",
      icon: "medkit-outline",
      title: "Understanding medical terms",
      content: "• Blood Pressure: Force of blood against artery walls\n• BMI: Body Mass Index measures body fat\n• HDL/LDL: Good and bad cholesterol levels\n• Glucose: Blood sugar levels\n• Hypertension: High blood pressure condition\n• Consult your doctor for detailed explanations"
    },
    {
      id: "medicine-log",
      icon: "document-text-outline",
      title: "Managing your medicine log",
      content: "• Add medications with name and dosage\n• Set custom reminders for each medicine\n• Track adherence and missed doses\n• View medication history and patterns\n• Set up refill reminders\n• Share medication list with healthcare providers"
    },
    {
      id: "update-profile",
      icon: "person-circle-outline",
      title: "Updating your profile",
      content: "• Edit personal information in Settings\n• Update emergency contact details\n• Modify health conditions and allergies\n• Change notification preferences\n• Adjust privacy settings\n• Sync with other health apps and devices"
    }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <Ionicons name="help-circle-outline" size={32} color="#fff" />
      </View>

      {/* EMERGENCY SECTION */}
      <View style={styles.emergencyBox}>
        <Ionicons name="alert-circle-outline" size={28} color="#D32F2F" />
        <View style={{}}>
          <Text style={styles.emergencyTitle}>Emergency?</Text>
          <Text style={styles.emergencyText}>Call 112 or your nearest hospital immediately.</Text>
        </View>
      </View>

      {/* HELP TOPICS */}
      <Text style={styles.sectionTitle}>Help Topics</Text>

      {helpTopics.map((topic) => (
        <HelpCard 
          key={topic.id}
          icon={topic.icon}
          title={topic.title}
          content={topic.content}
          isExpanded={expandedTopic === topic.id}
          onPress={() => toggleTopic(topic.id)}
        />
      ))}

      {/* CONTACT SUPPORT */}
      <Text style={styles.sectionTitle}>Support</Text>

      <TouchableOpacity style={styles.supportButton}>
        <Ionicons name="chatbubble-ellipses-outline" size={22} color="#fff" />
        <Text style={styles.supportButtonText}>Chat with Support</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.supportButton} onPress={handleEmailUs}>
        <Ionicons name="mail-outline" size={22} color="#fff" />
        <Text style={styles.supportButtonText}>Email Us</Text>
      </TouchableOpacity>

      {/* FAQ */}
      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

      <FAQ question="Is my health data safe?" answer="Yes. Your data is securely encrypted and never shared." />
      <FAQ question="How often should I update my readings?" answer="For best results, update daily or after any changes." />
      <FAQ question="Can I use the app offline?" answer="Yes, some features work offline. Sync happens when online." />
    </ScrollView>
  );
};

const HelpCard = ({ icon, title, content, isExpanded, onPress }) => (
  <TouchableOpacity style={styles.helpCard} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.helpCardHeader}>
      <View style={styles.helpCardLeft}>
        <Ionicons name={icon} size={26} color="#4A90E2" />
        <Text style={styles.helpCardText}>{title}</Text>
      </View>
      <Ionicons 
        name={isExpanded ? "chevron-up" : "chevron-down"} 
        size={24} 
        color="#4A90E2" 
      />
    </View>
    
    {isExpanded && (
      <View style={styles.helpCardContent}>
        <Text style={styles.helpCardContentText}>{content}</Text>
      </View>
    )}
  </TouchableOpacity>
);

const FAQ = ({ question, answer }) => (
  <View style={styles.faqBox}>
    <Text style={styles.faqQuestion}>{question}</Text>
    <Text style={styles.faqAnswer}>{answer}</Text>
  </View>
);

export default Help;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F0FA",
  },

  header: {
    backgroundColor: "#4A90E2",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 35,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },

  emergencyBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE5E5",
    padding: 15,
    borderRadius: 14,
    marginHorizontal: 20,
    borderLeftWidth: 6,
    borderLeftColor: "#D32F2F",
    marginBottom: 20,
  },

  emergencyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#D32F2F",
  },

  emergencyText: {
    fontSize: 13,
    color: "#B71C1C",
  },

  sectionTitle: {
    marginLeft: 20,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#4A90E2",
  },

  helpCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: "#4A90E2",
  },

  helpCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  helpCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  helpCardText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#4A90E2",
    fontWeight: "600",
    flex: 1,
  },

  helpCardContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E6F0FA",
  },

  helpCardContentText: {
    fontSize: 14,
    color: "#6D9DD8",
    lineHeight: 20,
  },

  supportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A90E2",
    marginHorizontal: 20,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 12,
  },

  supportButtonText: {
    marginLeft: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  faqBox: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 14,
    elevation: 3,
    marginBottom: 12,
  },

  faqQuestion: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4A90E2",
    marginBottom: 4,
  },

  faqAnswer: {
    fontSize: 14,
    color: "#6D9DD8",
  },
});