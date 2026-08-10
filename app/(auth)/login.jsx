import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView, Platform,
  Pressable,
  ScrollView,
  StyleSheet, Text, View
} from 'react-native';
import Button from '../../components/Button';
import ScreenWrapper from '../../components/ScreenWrapper';
import Input from '../../components/input';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';
import { saveTokens } from '../../utils/authStorage';

const Login = () => {
  const router = useRouter();
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  // const fetchUserProfile = async (id, token) => {
  //   try {
  //     const res = await fetch(`http://172.168.17.209:8080/api/auth/user/${id}`, {
  //       headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
  //     });
  //     const data = await res.json();
  //     return res.ok ? data : null;
  //   } catch {
  //     return null;
  //   }
  // };

const onSubmit = async () => {
  if (!emailRef.current || !passwordRef.current) {
    return Alert.alert(
      'Login',
      'Please fill all the fields'
    );
  }

  setLoading(true);

  try {
    const res = await fetch(
      'http://10.88.86.70:8000/api/user/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailRef.current,
          password: passwordRef.current,
        }),
      }
    );

    const data = await res.json();

    console.log('LOGIN RESPONSE:', data);

    if (!res.ok) {
      return Alert.alert(
        'Error',
        data.message || 'Invalid credentials'
      );
    }

    // Get tokens from backend
    const accessToken = data.accessToken;
    const refreshToken = data.refreshToken;

    if (!accessToken || !refreshToken) {
      return Alert.alert(
        'Error',
        'Authentication tokens not received'
      );
    }

    // Store tokens securely
    await saveTokens(
      accessToken,
      refreshToken
    );

    // User ID
    const id = data.user?.id;

    if (!id) {
      return Alert.alert(
        'Error',
        'User ID not found'
      );
    }

    // Store user information separately
    const user = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      isVerified: data.user.isVerified,
    };

    await AsyncStorage.setItem(
      'user',
      JSON.stringify(user)
    );

    Alert.alert(
      'Success',
      data.message || 'Login successful!'
    );

    router.replace('/(tabs)/Home');

  } catch (error) {
    console.error('LOGIN ERROR:', error);

    Alert.alert(
      'Error',
      'Cannot connect to server.'
    );

  } finally {
    setLoading(false);
  }
};

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>

          <Image
            source={require('../../assets/images/welcome.png')}
            style={styles.image}
            resizeMode="contain"
          />

          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to your account to continue.</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <Input
              placeholder="Enter your email"
              keyboardType="email-address"
              onChangeText={v => emailRef.current = v}
            />

            <Text style={styles.label}>Password</Text>
            <Input
              placeholder="Enter your password"
              secureTextEntry
              onChangeText={v => passwordRef.current = v}
            />

            <View style={styles.options}>
              <Pressable onPress={() => setRemember(!remember)} style={styles.remember}>
                <View style={[styles.checkbox, remember && styles.checked]}>
                  {remember && <Text>✓</Text>}
                </View>
                <Text style={styles.small}>Remember me</Text>
              </Pressable>

              <Pressable onPress={() => router.push('/(auth)/forgot')}>
                <Text style={styles.small}>Forgot Password?</Text>
              </Pressable>
            </View>

            <Button
              title="Sign In"
              loading={loading}
              onPress={onSubmit}
              buttonStyle={styles.loginButton}
            />
          </View>

          <View style={styles.or}>
            <View style={styles.line} />
            <Text>Or</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socials}>
            <Pressable style={styles.social}>
              <FontAwesome name="google" size={22} color="#DB4437" />
            </Pressable>

            <Pressable style={styles.social}>
              <FontAwesome name="apple" size={23} color="#000" />
            </Pressable>

            <Pressable style={styles.social}>
              <FontAwesome name="facebook" size={22} color="#1877F2" />
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.small}>Don't have an account?</Text>
            <Pressable onPress={() => router.push('/(auth)/signUp')}>
              <Text style={[styles.small, styles.signup]}> Sign Up</Text>
            </Pressable>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: wp(6),
    paddingTop: hp(2),
    backgroundColor: theme.colors.background
  },
  image: {
    width: wp(25),
    height: hp(15),
    alignSelf: 'center',
    marginBottom: hp(1)
  },
  title: {
    fontSize: hp(3.4),
    fontWeight: '700',
    textAlign: 'center',
    color: theme.colors.text
  },
  subtitle: {
    textAlign: 'center',
    color: '#999',
    fontSize: hp(1.7),
    marginTop: 5,
    marginBottom: hp(2)
  },
  form: { gap: 8 },
  label: {
    fontSize: hp(1.5),
    color: theme.colors.text,
    marginTop: 5
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 3
  },
  remember: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary
  },
  small: {
    fontSize: hp(1.5),
    color: '#888'
  },
  loginButton: {
    marginTop: 10,
    borderRadius: 30,
    height: hp(6.5)
  },
  or: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: hp(3)
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e5e5'
  },
  socials: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12
  },
  social: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(7),
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: hp(7)
  },
  signup: {
    color: theme.colors.primary,
    fontWeight: '600'
  }
});