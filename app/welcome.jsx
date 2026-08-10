import { useRouter } from 'expo-router';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { FontAwesome } from '@expo/vector-icons';

import Button from '../components/Button';
import ScreenWrapper from '../components/ScreenWrapper';
import { hp, wp } from '../helpers/common';

const Welcome = () => {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <View style={styles.container}>

        {/* Image */}
        <Image
          style={styles.welcomeImage}
          resizeMode="contain"
          source={require('../assets/images/DTlogo.png')}
        />

        {/* Text Section */}
        <View style={styles.textSection}>
          <Text style={styles.title1}>
            Welcome to <Text style={styles.title}>DivyaTulsi</Text>
          </Text>

          <Text style={styles.punchline}>
            Every corner holds a story — you only have to explore.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>

          {/* Getting Started */}
          <Button
            title="Get Started"
            buttonStyle={styles.primaryButton}
            textStyle={{
              fontSize: hp(2),
              fontWeight: '600',
            }}
            onPress={() => router.push('signUp')}
          />

          {/* OR Divider */}
          <View style={styles.orContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>Or</Text>
            <View style={styles.line} />
          </View>

          {/* Google Button */}
          <Pressable
            style={styles.socialButton}
            onPress={() => console.log('Google Login')}
          >
            <FontAwesome
              name="google"
              size={hp(2.4)}
              color="#DB4437"
            />

            <Text style={styles.socialButtonText}>
              Continue with Google
            </Text>
          </Pressable>

          {/* Apple Button */}
          <Pressable
            style={styles.socialButton}
            onPress={() => console.log('Apple Login')}
          >
            <FontAwesome
              name="apple"
              size={hp(2.5)}
              color="#000"
            />

            <Text style={styles.socialButtonText}>
              Continue with Apple
            </Text>
          </Pressable>

          {/* Facebook Button */}
          <Pressable
            style={styles.socialButton}
            onPress={() => console.log('Facebook Login')}
          >
            <FontAwesome
              name="facebook"
              size={hp(2.5)}
              color="#1877F2"
            />

            <Text style={styles.socialButtonText}>
              Continue with Facebook
            </Text>
          </Pressable>

          {/* Login */}
          <View style={styles.bottomTextContainer}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <Pressable onPress={() => router.push('login')}>
              <Text style={styles.loginLink}>
                Login
              </Text>
            </Pressable>
          </View>

        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: wp(4),
  },

  /* Image */
  welcomeImage: {
    height: hp(30),
    width: wp(80),
  },

  /* Text */
  textSection: {
    alignItems: 'center',
    gap: 15,
  },

  title1: {
    fontSize: hp(3),
    fontWeight: '700',
    textAlign: 'center',
    color: '#4A90E2',
  },

  title: {
    fontSize: hp(3.5),
    fontWeight: '800',
    textAlign: 'center',
    color: '#4A90E2',
  },

  punchline: {
    fontSize: hp(1.9),
    color: '#679BD6',
    textAlign: 'center',
    paddingHorizontal: wp(10),
  },

  /* Footer */
  footer: {
    width: '100%',
    gap: 10,
  },

  /* Main Button */
  primaryButton: {
    marginHorizontal: wp(3),
    backgroundColor: '#4A90E2',
    borderRadius: 30,
    paddingVertical: 14,
  },

  /* OR */
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: wp(3),
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },

  orText: {
    marginHorizontal: 12,
    fontSize: hp(1.7),
    color: '#777',
  },

  /* Social Buttons */
  socialButton: {
    height: hp(6.2),
    marginHorizontal: wp(3),
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },

  socialButtonText: {
    fontSize: hp(1.7),
    color: '#333',
    fontWeight: '500',
  },

  /* Login */
  bottomTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 70,
    marginBottom: 10,
  },

  loginText: {
    fontSize: hp(1.7),
    color: '#679BD6',
  },

  loginLink: {
    fontSize: hp(1.7),
    color: '#4A90E2',
    fontWeight: '700',
  },
});