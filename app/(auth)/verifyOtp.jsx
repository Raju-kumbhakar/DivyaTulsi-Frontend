import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import api from "../../utils/api";

const COOLDOWN = 60;

export default function VerifyOtp() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const inputs = useRef([]);

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(COOLDOWN);

  useEffect(() => {
    if (!seconds) return;

    const timer = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const changeOtp = (text, index) => {
    const value = text.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];

    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const keyPress = ({ nativeEvent }, index) => {
    if (
      nativeEvent.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
    }
  };

  const verify = async () => {
    const code = otp.join("");

    if (code.length !== 4) {
      return Alert.alert("Invalid OTP", "Enter the 4-digit OTP.");
    }

    setLoading(true);

    try {
      const { data } = await api.post("/user/verifyOtp", {
        email,
        otp: code,
      });

      Alert.alert(
        "Success",
        data.message || "Email verified successfully!",
        [{ text: "OK", onPress: () => router.replace("/login") }]
      );
    } catch (error) {
      Alert.alert(
        "Verification Failed",
        error.response?.data?.message ||
          "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (seconds || loading) return;

    try {
      const { data } = await api.post("/user/sendOtp", { email });

      Alert.alert(
        "OTP Sent",
        data.message || "New OTP sent successfully!"
      );

      setSeconds(COOLDOWN);
      setOtp(["", "", "", ""]);
      inputs.current[0]?.focus();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Unable to resend OTP."
      );
    }
  };

  const complete = otp.join("").length === 4;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>

        <Pressable
          style={styles.back}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        {/* Icon */}
        <View style={styles.icon}>
          <Text style={styles.phone}>📱</Text>

          <View style={styles.check}>
            <Text style={styles.checkText}>✓</Text>
          </View>
        </View>

        {/* Heading */}
        <Text style={styles.title}>OTP Verification</Text>

        <Text style={styles.sub}>
          Enter the OTP sent to
        </Text>

        <Text style={styles.email}>{email}</Text>

        {/* OTP */}
        <View style={styles.otp}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={(ref) => (inputs.current[i] = ref)}
              value={digit}
              onChangeText={(text) => changeOtp(text, i)}
              onKeyPress={(e) => keyPress(e, i)}
              keyboardType="number-pad"
              maxLength={1}
              editable={!loading}
              autoFocus={i === 0}
              textAlign="center"
              style={[
                styles.box,
                digit && styles.active,
              ]}
            />
          ))}
        </View>

        {/* Resend */}
        <View style={styles.resend}>
          <Text style={styles.gray}>
            Didn't receive the OTP?
          </Text>

          <Pressable
            onPress={resend}
            disabled={!!seconds || loading}
          >
            <Text
              style={[
                styles.green,
                seconds && styles.disabledText,
              ]}
            >
              {seconds
                ? ` Resend in 00:${String(seconds).padStart(2, "0")}`
                : " Resend OTP"}
            </Text>
          </Pressable>
        </View>

        {/* Verify */}
        <Pressable
          onPress={verify}
          disabled={!complete || loading}
          style={[
            styles.button,
            (!complete || loading) && styles.disabled,
          ]}
        >
          <Text style={styles.buttonText}>
            {loading ? "Verifying..." : "Verify"}
          </Text>
        </Pressable>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7F5",
  },

  card: {
    flex: 1,
    margin: 6,
    borderRadius: 28,
    backgroundColor: "#FFF",
    alignItems: "center",
    paddingTop: 45,
  },

  back: {
    position: "absolute",
    left: 24,
    top: 45,
  },

  backText: {
    fontSize: 40,
    color: "#222",
  },

  icon: {
    marginTop: 75,
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#BFE8C3",
    justifyContent: "center",
    alignItems: "center",
  },

  phone: {
    fontSize: 80,
  },

  check: {
    position: "absolute",
    right: 15,
    bottom: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#55A95A",
    justifyContent: "center",
    alignItems: "center",
  },

  checkText: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "bold",
  },

  title: {
    marginTop: 25,
    fontSize: 27,
    fontWeight: "700",
    color: "#202020",
  },

  sub: {
    marginTop: 15,
    color: "#777",
    fontSize: 15,
  },

  email: {
    marginTop: 5,
    color: "#55A95A",
    fontSize: 16,
    fontWeight: "600",
  },

  otp: {
    flexDirection: "row",
    gap: 12,
    marginTop: 35,
  },

  box: {
    width: 62,
    height: 62,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    backgroundColor: "#FFF",
    fontSize: 25,
    fontWeight: "600",
    color: "#222",
  },

  active: {
    borderColor: "#55A95A",
    borderWidth: 2,
  },

  resend: {
    flexDirection: "row",
    marginTop: 45,
    alignItems: "center",
  },

  gray: {
    color: "#888",
    fontSize: 15,
  },

  green: {
    color: "#55A95A",
    fontWeight: "600",
    fontSize: 15,
  },

  disabledText: {
    color: "#999",
  },

  button: {
    position: "absolute",
    bottom: 95,
    left: 30,
    right: 30,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#55A95A",
    justifyContent: "center",
    alignItems: "center",
  },

  disabled: {
    backgroundColor: "#AAA",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});