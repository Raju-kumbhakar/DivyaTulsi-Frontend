import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

const CreateButton = ({ onPress }) => (
  <Pressable onPress={onPress} style={styles.createButton}>
    <View style={styles.createCircle}>
      <Ionicons name="add" size={30} color="#fff" />
    </View>
  </Pressable>
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#9700FF",
        tabBarInactiveTintColor: "#aaa",
        tabBarLabelStyle: {
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="Campus"
        options={{
          title: "Campus",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="school" size={size} color={color} />
          ),
        }}
      />

      {/* CREATE */}
      <Tabs.Screen
        name="Create"
        options={{
          title: "",
          tabBarButton: (props) => (
            <CreateButton onPress={props.onPress} />
          ),
        }}
      />

      <Tabs.Screen
        name="Trophy"
        options={{
          title: "Trophy",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 58,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: "#111",
    borderTopColor: "#292929",
  },

  createButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  createCircle: {
    width: 45,
    height: 45,
    borderRadius: 24,
    backgroundColor: "#9700FF",
    alignItems: "center",
    justifyContent: "center",
  },
});