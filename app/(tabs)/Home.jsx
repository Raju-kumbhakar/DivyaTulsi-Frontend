import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const posts = [
  {
    user: "mokshmishra",
    time: "26 days ago",
    tags: "#gossip   #random   #exams   #confession",
    text: "daily result ajj ayega sunkar pakka gya hu(btech 2nd sem) 😭😈",
    likes: 6,
    comments: 0,
    views: 80,
  },
  {
    user: "shrishti_7",
    time: "26 days ago",
    tags: "#tea   #gossip   #random   #exams   #attendance",
    text: "Are you excited to go to college?? 😬\nmine is 50/50😌",
    likes: 15,
    comments: 12,
    views: 330,
  },
];

export default function Home() {
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>CampusX</Text>

        <View style={styles.headerIcons}>
          <Pressable style={styles.anon}>
            <Ionicons name="eye-off-outline" size={14} color="#999" />
            <Text style={styles.anonText}>Anon</Text>
          </Pressable>

          <Ionicons name="search-outline" size={24} color="white" />
          <Ionicons name="notifications-outline" size={25} color="white" />
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={25}
            color="white"
          />
        </View>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        {["For You", "My Campus", "Nearby", "Global"].map((item, index) => (
          <Pressable
            key={item}
            style={[styles.tab, index === 0 && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                index === 0 && styles.activeTabText,
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Feed */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feed}
      >
        {posts.map((post, index) => (
          <View style={styles.post} key={index}>

            {/* User */}
            <View style={styles.postHeader}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={20} color="#aaa" />
              </View>

              <View>
                <View style={styles.nameRow}>
                  <Text style={styles.username}>{post.user}</Text>
                  <Text style={styles.time}>{post.time}</Text>
                </View>

                <Text style={styles.tags}>{post.tags}</Text>
              </View>

              <Ionicons
                name="ellipsis-horizontal"
                size={18}
                color="#777"
                style={styles.more}
              />
            </View>

            {/* Text */}
            <Text style={styles.postText}>{post.text}</Text>

            {/* Actions */}
            <View style={styles.actions}>
              <Action icon="heart-outline" value={post.likes} />
              <Action icon="chatbubble-outline" value={post.comments} />
              <Action icon="repeat-outline" />
              <Action icon="paper-plane-outline" />
              <Action icon="bookmark-outline" />
              <Action icon="eye-outline" value={post.views} />
            </View>
          </View>
        ))}
      </ScrollView>

    </View>
  );
}

function Action({ icon, value }) {
  return (
    <View style={styles.action}>
      <Ionicons name={icon} size={19} color="white" />

      {value !== undefined && (
        <Text style={styles.count}>{value}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080808",
  },

  /* HEADER */
  header: {
    height: 100,
    paddingTop: 45,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#1c1c1c",
  },

  logo: {
    color: "white",
    fontSize: 20,
    fontWeight: "800",
  },

  headerIcons: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },

  anon: {
    backgroundColor: "#292929",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  anonText: {
    color: "#999",
    fontSize: 13,
    fontWeight: "600",
  },

  /* TABS */
  tabs: {
    paddingHorizontal:10,
    paddingVertical: 8,
  },

  tab: {
    height: 28,
    paddingHorizontal: 20,
    marginRight: 8,
    borderRadius: 22,
    backgroundColor: "#1d1d1d",
    borderWidth: 1,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "#8500ff",
    borderColor: "#8500ff",
  },

  tabText: {
    color: "#999",
    fontSize: 14,
  },

  activeTabText: {
    color: "white",
    fontWeight: "700",
  },

  /* FEED */
  feed: {
    paddingBottom: 20,
  },

  post: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "#242424",
    borderRadius: 22,
    marginBottom: 3,
  },

  postHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  username: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  time: {
    color: "#777",
    fontSize: 12,
    marginLeft: 7,
  },

  tags: {
    color: "#4389e8",
    fontSize: 12,
    marginTop: 5,
    maxWidth: 300,
  },

  more: {
    marginLeft: "auto",
    marginTop: 5,
  },

  postText: {
    color: "white",
    fontSize: 16,
    lineHeight: 23,
    marginTop: 15,
    marginLeft: 52,
    marginBottom: 18,
  },

  /* ACTIONS */
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },

  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  count: {
    color: "#ddd",
    fontSize: 12,
  },
});