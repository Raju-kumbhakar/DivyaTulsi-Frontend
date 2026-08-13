import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  Modal
} from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";

const PURPLE = "#9700FF";

const MenuItem = ({ icon, title, onPress }) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
  >
    <Ionicons
      name={icon}
      size={27}
      color="#fff"
    />
    <Text style={styles.menuText}>
      {title}
    </Text>
    <Ionicons
      name="chevron-forward"
      size={23}
      color="#aaa"
      style={styles.arrow}
    />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const loadUser = async () => {
    const data = await AsyncStorage.getItem("user");
    if (data) setUser(JSON.parse(data));
  };

  useFocusEffect(useCallback(() => {
    loadUser();
  }, []));

  useEffect(() => {
    loadUser();
  }, []);

  const name = user?.name || "Mighty";
  const username = user?.username || "mightyx";

  return (
    <ScreenWrapper bg="#0D0D0D">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.page}
      >

          <Modal
          visible={menuVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setMenuVisible(false)}
          >
          <View style={styles.modalContainer}>
          {/* DARK BACKDROP */}
          <Pressable
          style={styles.backdrop}
          onPress={() => setMenuVisible(false)}
          />
          {/* MENU */}
          <View style={styles.menu}>

          <MenuItem
            icon="notifications-outline"
            title="Notification settings"
            onPress={() => {
              setMenuVisible(false);
              // router.push("/pages/notifications");
            }}
          />
          <MenuItem
            icon="bookmark-outline"
            title="Saved"
            onPress={() => {
              setMenuVisible(false);
              // router.push("/pages/saved");
            }}
          />
          <MenuItem
            icon="heart-outline"
            title="Liked"
            onPress={() => {
              setMenuVisible(false);
              // router.push("/pages/liked");
            }}
          />
          <MenuItem
            icon="archive-outline"
            title="Archive"
            onPress={() => {
              setMenuVisible(false);
              // router.push("/pages/archive");
            }}
          />
          <MenuItem
            icon="people-outline"
            title="Account Manager"
            onPress={() => {
              setMenuVisible(false);
              // router.push("/pages/accountManager");
            }}
          />
          <MenuItem
            icon="settings-outline"
            title="Settings"
            onPress={() => {
              setMenuVisible(false);
              // router.push("/pages/settings");
            }}
          />

          {/* SEPARATOR */}
          <View style={styles.separator} />

          {/* LOGOUT */}
          <TouchableOpacity
            style={styles.logoutItem}
            onPress={async () => {
              setMenuVisible(false);
              await logout();
              router.replace("/(auth)/login");
            }}
          >
            <Ionicons
              name="log-out-outline"
              size={28}
              color="#ff3333"
            />

            <Text style={styles.logoutText}>
              Logout
            </Text>
          </TouchableOpacity>

          </View>
          </View>
          </Modal>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerName}>{name}</Text>

          <View style={styles.headerIcons}>
            <View style={styles.private}>
              <Text style={styles.privateText}>Private</Text>
            </View>

            <Ionicons name="person-outline" size={23} color="white" />
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <Ionicons name="menu" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* AVATAR */}
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color="#999" />

            <View style={styles.edit}>
              <Ionicons name="pencil" size={14} color="white" />
            </View>
          </View>

          <Text style={styles.name}>{name}</Text>
          <Text style={styles.username}>@{username}</Text>
        </View>

        {/* STATS */}
        <View style={styles.stats}>
          <Stat title="Posts" />
          <Stat title="Followers" />
          <Stat title="Following" />
        </View>

        {/* CAMPUS */}
        <View style={styles.campus}>
          <Text style={styles.v}>V</Text>
          <Text style={styles.zero}>0</Text>

          <View style={styles.divider} />

          <Text style={styles.explore}>🔎 Campus Explorer</Text>

          <Text style={styles.percent}>0.0%</Text>
        </View>

        {/* BIO */}
        <Text style={styles.bio}>
          Hey guys i'm vibing on Vibeesta, are you?
        </Text>

        {/* VERIFY */}
        <View style={styles.verify}>
          <Ionicons
            name="shield-half-outline"
            size={18}
            color={PURPLE}
          />

          <Text style={styles.verifyText} numberOfLines={1}>
            Guest Account - Verify for full access of features
          </Text>

          <Ionicons
            name="chevron-forward"
            size={17}
            color="#aaa"
          />
        </View>

        {/* BUTTONS */}
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              router.push({
                pathname: "/pages/editProfile",
                params: { refresh: "true" },
              })
            }
          >
            <Text style={styles.buttonText}>Edit profile</Text>
          </TouchableOpacity>
        </View>

        {/* TABS */}
        <View style={styles.tabs}>
          {["Hot opinio", "Scrolls", "Events", "Tag"].map((item, i) => (
            <View key={item} style={styles.tab}>
              <Text style={[styles.tabText, i === 0 && styles.active]}>
                {item}
              </Text>

              {i === 0 && <View style={styles.underline} />}
            </View>
          ))}
        </View>

        {/* FILTERS */}
        <View style={styles.filters}>
          <View style={[styles.filter, styles.activeFilter]}>
            <Text style={styles.filterText}>All</Text>
          </View>

          <View style={styles.filter}>
            <Text style={styles.filterText}>General</Text>
          </View>

          <View style={styles.filter}>
            <Text style={styles.filterText}>Anonymous</Text>
          </View>
        </View>

        <Text style={styles.empty}>
          No hot opinions found.
        </Text>

      </ScrollView>
    </ScreenWrapper>
  );
}

function Stat({ title }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statNumber}>0</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingBottom: 70,
  },

modalContainer: {
  flex: 1,
  justifyContent: "flex-end",
},

backdrop: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(0,0,0,0.65)",
},

menu: {
  backgroundColor: "#1D1D1F",
  borderTopLeftRadius: 28,
  borderTopRightRadius: 28,
  paddingTop: 20,
  paddingBottom: 25,
  paddingHorizontal: 28,
},

menuItem: {
  height: 65,
  flexDirection: "row",
  alignItems: "center",
},

menuText: {
  color: "#fff",
  fontSize: 17,
  marginLeft: 28,
},

arrow: {
  marginLeft: "auto",
},

separator: {
  height: 1,
  backgroundColor: "#555",
  marginVertical: 8,
},

logoutItem: {
  height: 60,
  flexDirection: "row",
  alignItems: "center",
},

logoutText: {
  color: "#ff3333",
  fontSize: 17,
  marginLeft: 28,
},

  /* HEADER */
  header: {
    height: 38,
    paddingHorizontal: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  private: {
    borderWidth: 1.3,
    borderColor: PURPLE,
    borderRadius: 16,
    paddingHorizontal: 11,
    paddingVertical: 3,
  },

  privateText: {
    color: "#D66AFF",
    fontSize: 13,
    fontWeight: "700",
  },

  /* PROFILE */
  profile: {
    alignItems: "center",
    marginTop: 15,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 68,
    backgroundColor: "#E7E7E7",
    alignItems: "center",
    justifyContent: "center",
  },

  edit: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 37,
    height: 37,
    borderRadius: 19,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },

  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 9,
  },

  username: {
    color: "#999",
    fontSize: 15,
    marginTop: 0,
  },

  /* STATS */
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 19,
    paddingHorizontal: 55,
  },

  stat: {
    alignItems: "center",
  },

  statNumber: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  statTitle: {
    color: "#999",
    fontSize: 14,
    marginTop: 1,
  },

  /* CAMPUS */
  campus: {
    height: 50,
    marginHorizontal: 20,
    marginTop: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#181818",
    flexDirection: "row",
    alignItems: "center",
  },

  v: {
    color: "#7770FF",
    fontSize: 23,
  },

  zero: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 4,
  },

  divider: {
    width: 1,
    height: 25,
    backgroundColor: "#555",
    marginHorizontal: 10,
  },

  explore: {
    color: "#ccc",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },

  percent: {
    color: "#aaa",
    fontSize: 10,
    backgroundColor: "#252525",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 14,
  },

  /* BIO */
  bio: {
    color: "#eee",
    textAlign: "center",
    fontSize: 14,
    marginTop: 32,
  },

  /* VERIFY */
  verify: {
    height: 38,
    marginHorizontal: 35,
    marginTop: 7,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1.3,
    borderColor: "#7300A8",
    backgroundColor: "#26002F",
    flexDirection: "row",
    alignItems: "center",
  },

  verifyText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    flex: 1,
    marginHorizontal: 6,
  },

  /* BUTTONS */
  buttons: {
    flexDirection: "row",
    gap: 18,
    marginHorizontal: 20,
    marginTop: 30,
  },

  button: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  /* TABS */
  tabs: {
    height: 46,
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  tabText: {
    color: "#999",
    fontSize: 13,
  },

  active: {
    color: "#fff",
  },

  underline: {
    position: "absolute",
    bottom: -1,
    width: "80%",
    height: 2,
    backgroundColor: "#fff",
  },

  /* FILTERS */
  filters: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 18,
    marginTop: 11,
  },

  filter: {
    flex: 1,
    height: 30,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#555",
    alignItems: "center",
    justifyContent: "center",
  },

  activeFilter: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
  },

  filterText: {
    color: "#fff",
    fontSize: 13,
  },

  empty: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    marginTop: 170,
  },
});