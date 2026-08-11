import { useRef, useState } from 'react';

import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View, } from 'react-native';

import Button from '../../components/Button';
import ScreenWrapper from '../../components/ScreenWrapper';
import Input from '../../components/input';

import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';

import { HugeiconsIcon } from '@hugeicons/react-native';
import { Call02Icon, Mail02Icon, SquareLock01Icon, UserIcon, } from '@hugeicons/core-free-icons';

import api from '../../utils/api';

const SignUp = () => {
  const router = useRouter();
  const name = useRef('');
  const email = useRef('');
  const phone = useRef('');
  const password = useRef('');
  const confirm = useRef('');
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (
      !name.current ||
      !email.current ||
      !phone.current ||
      !password.current ||
      !confirm.current
    ) {
      return Alert.alert('Sign Up', 'Please fill all fields');
    }
    if (password.current !== confirm.current) {
      return Alert.alert('Sign Up', 'Passwords do not match');
    }

    setLoading(true);
    const t0 = Date.now();
    console.log('REGISTER REQUEST SENT', new Date().toISOString());
    try {
      
      const res = await api.post('/user/register', {
        name: name.current.trim(),
        email: email.current.trim().toLowerCase(),
        phone: phone.current.trim(),
        password: password.current,
        role: role,
      });
       console.log(`REGISTER SUCCESS at +${Date.now() - t0}ms`);
      const data = res.data;
      console.log('REGISTER RESPONSE:', data);

      Alert.alert(
        'Success',
        data.message || 'Registration successful. Please verify your email.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.push({
                pathname: '/(auth)/verifyOtp',
                params: {
                  email: email.current.trim().toLowerCase(),
                },
              });
            },
          },
        ]
      );

    } catch (error) {
       console.log(`REGISTER FAILED at +${Date.now() - t0}ms`, error.code, error.message);
      if (error.response) {
        Alert.alert('Error', error.response.data?.message || 'Registration failed');
      } else if (error.request) {
        Alert.alert('Error', 'Cannot reach server — check your IP address and that the device is on the same network.');
      } else {
        Alert.alert('Error', error.message);
      }
      console.error('REGISTER ERROR:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const Icon = ({ icon }) => (
    <HugeiconsIcon
      icon={icon}
      size={23}
      color={theme.colors.text}
      strokeWidth={1.6}
    />
  );

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >

          <Image
            source={require('../../assets/images/profile.png')}
            style={styles.image}
            resizeMode="contain"
          />

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Sign up to get started with your dashboard.
          </Text>

          <View style={styles.toggle}>
            {['patient', 'doctor'].map(item => (
              <Pressable
                key={item}
                onPress={() => setRole(item)}
                style={[
                  styles.toggleBtn,
                  role === item && styles.activeToggle
                ]}
              >
                <Text style={[
                  styles.toggleText,
                  role === item && styles.activeText
                ]}>
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.form}>

            <Text style={styles.label}>Full Name</Text>
            <Input
              icon={<Icon icon={UserIcon} />}
              placeholder="Enter your name"
              onChangeText={v => name.current = v}
            />

            <Text style={styles.label}>Email</Text>
            <Input
              icon={<Icon icon={Mail02Icon} />}
              placeholder="Enter your email"
              keyboardType="email-address"
              onChangeText={v => email.current = v}
            />

            <Text style={styles.label}>Mobile Number</Text>
            <Input
              icon={<Icon icon={Call02Icon} />}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              onChangeText={v => phone.current = v}
            />

            <Text style={styles.label}>Password</Text>
            <Input
              icon={<Icon icon={SquareLock01Icon} />}
              placeholder="Create a password"
              secureTextEntry
              onChangeText={v => password.current = v}
            />

            <Text style={styles.label}>Confirm Password</Text>
            <Input
              icon={<Icon icon={SquareLock01Icon} />}
              placeholder="Confirm password"
              secureTextEntry
              onChangeText={v => confirm.current = v}
            />

            <Button
              title="Create Account"
              loading={loading}
              onPress={onSubmit}
              buttonStyle={styles.button}
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
            <Text style={styles.footerText}>
              Already have an account?
            </Text>
            <Pressable onPress={() => router.push('/login')}>
              <Text style={styles.login}> Sign In</Text>
            </Pressable>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: wp(6),
    paddingTop: hp(2),
    paddingBottom: hp(3),
    backgroundColor: theme.colors.background
  },
  title: {
    fontSize: hp(3.3),
    fontWeight: '700',
    textAlign: 'center',
    color: theme.colors.text,
  },
  subtitle: {
    textAlign: 'center',
    color: '#999',
    fontSize: hp(1.7),
    marginTop: 5,
    marginBottom: hp(2),
  },
  image: {
    width: wp(25),
    height: hp(15),
    alignSelf: 'center',
    marginBottom: hp(1)
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F1F1',
    borderRadius: 25,
    padding: 3,
    marginBottom: hp(1.5),
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 22,
  },
  activeToggle: {
    backgroundColor: theme.colors.primary,
  },
  toggleText: {
    color: '#777',
    fontWeight: '500',
  },
  activeText: {
    color: '#fff',
    fontWeight: '600',
  },
  form: { gap: 5 },
  label: {
    fontSize: hp(1.5),
    color: theme.colors.text,
    marginTop: 5,
  },
  button: {
    marginTop: 10,
    borderRadius: 30,
    height: hp(6.5),
  },
  or: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(2.5),
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e5e5',
  },
  orText: {
    marginHorizontal: 12,
    color: '#777',
  },
  socials: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  social: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(7),
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: hp(5),
  },
  footerText: {
    color: '#999',
    fontSize: hp(1.6),
  },
  login: {
    color: theme.colors.primary,
    fontSize: hp(1.6),
    fontWeight: '600',
  },
});