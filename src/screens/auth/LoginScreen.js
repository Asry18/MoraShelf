import React, { useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { login, clearError } from '../../store/slices/authSlice';
import { useTheme } from '../../theme/ThemeContext';
import { LoginSchema } from '../../utils/validation';
import ThemeToggle from '../../components/common/ThemeToggle';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { theme, isDark } = useTheme();
  const { isAuthenticating, error, user } = useSelector(state => state.auth);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
    
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [dispatch]);

  // Navigate to home when user is successfully logged in
  useEffect(() => {
    if (user && !isAuthenticating) {
      // Navigation will be handled by AppNavigator based on auth state
    }
  }, [user, isAuthenticating]);

  // Show error alert if login fails
  useEffect(() => {
    if (error) {
      Alert.alert('Login Failed', error, [{ text: 'OK' }]);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleLogin = async (values) => {
    try {
      await dispatch(login({ email: values.email, password: values.password })).unwrap();
    } catch (err) {
      // Error is handled by useEffect above
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Background Decorations */}
      <View style={styles.backgroundDecorations}>
        <View style={[styles.circle, styles.circle1, { backgroundColor: theme.primary, opacity: 0.05 }]} />
        <View style={[styles.circle, styles.circle2, { backgroundColor: theme.primary, opacity: 0.08 }]} />
      </View>

      {/* Theme Toggle */}
      <View style={[styles.themeToggleContainer, { 
        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
      }]}>
        <ThemeToggle style={styles.themeToggle} />
      </View>

      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.navigate('Landing')}
        activeOpacity={0.7}
      >
        <View style={[styles.backButtonContainer, { 
          backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
        }]}>
          <Text style={[styles.backButtonText, { color: theme.primary }]}>← Back</Text>
        </View>
      </TouchableOpacity>
      
      <Animated.View 
        style={[
          styles.formContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        {/* Header with Icon */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
            <Text style={styles.icon}>📚</Text>
          </View>
          <Text style={[styles.title, { color: theme.primary }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: theme.textSub }]}>
            Sign in to continue to MoraShelf
          </Text>
        </View>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputWrapper}>
                <Text style={[styles.label, { color: theme.text }]}>
                  <Text style={styles.labelIcon}>✉️</Text> Email or Username
                </Text>
                <View style={[
                  styles.inputContainer,
                  {
                    borderColor: touched.email && errors.email ? (theme.error || '#FF6B6B') : theme.border,
                    backgroundColor: isDark ? '#2C2C2C' : '#FAFAFA',
                    shadowColor: theme.primary,
                    shadowOpacity: touched.email ? 0.1 : 0,
                  }
                ]}>
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="email@example.com or username"
                    placeholderTextColor={theme.textSub}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                  />
                </View>
                {touched.email && errors.email && (
                  <Text style={[styles.errorText, { color: theme.error || '#FF6B6B' }]}>
                    ⚠️ {errors.email}
                  </Text>
                )}
              </View>

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <Text style={[styles.label, { color: theme.text }]}>
                  <Text style={styles.labelIcon}>🔒</Text> Password
                </Text>
                <View style={[
                  styles.inputContainer,
                  {
                    borderColor: touched.password && errors.password ? (theme.error || '#FF6B6B') : theme.border,
                    backgroundColor: isDark ? '#2C2C2C' : '#FAFAFA',
                    shadowColor: theme.primary,
                    shadowOpacity: touched.password ? 0.1 : 0,
                  }
                ]}>
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="Enter your password"
                    placeholderTextColor={theme.textSub}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry
                  />
                </View>
                {touched.password && errors.password && (
                  <Text style={[styles.errorText, { color: theme.error || '#FF6B6B' }]}>
                    ⚠️ {errors.password}
                  </Text>
                )}
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.button, { opacity: isAuthenticating ? 0.6 : 1 }]}
                onPress={handleSubmit}
                disabled={isAuthenticating}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isDark ? ['#9D4EDD', '#7B2CBF'] : [theme.primary, '#8B5FBF']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {isAuthenticating ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.buttonText}>Sign In →</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
                <Text style={[styles.dividerText, { color: theme.textSub }]}>or</Text>
                <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              </View>

              {/* Register Link */}
              <TouchableOpacity 
                onPress={() => navigation.navigate('Register')} 
                style={[styles.linkButton, { 
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  borderColor: theme.primary + '30',
                }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.linkText, { color: theme.text }]}>
                  Don't have an account?{' '}
                  <Text style={[styles.linkTextBold, { color: theme.primary }]}>Register</Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center',
  },
  backgroundDecorations: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
  },
  circle1: {
    width: 300,
    height: 300,
    top: -150,
    right: -100,
  },
  circle2: {
    width: 250,
    height: 250,
    bottom: -100,
    left: -75,
  },
  themeToggleContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  themeToggle: {
    padding: 8,
  },
  backButton: { 
    position: 'absolute', 
    top: 50, 
    left: 20, 
    zIndex: 10,
  },
  backButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  backButtonText: { 
    fontSize: 16, 
    fontWeight: '600',
  },
  formContainer: { 
    padding: 24,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 40,
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 8,
  },
  subtitle: { 
    fontSize: 16, 
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    width: '100%',
  },
  inputWrapper: { 
    marginBottom: 20,
  },
  label: { 
    fontSize: 15, 
    marginBottom: 10, 
    fontWeight: '600',
  },
  labelIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  inputContainer: {
    borderWidth: 1.5,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    padding: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { 
    fontSize: 17, 
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  linkButton: { 
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  linkText: { 
    fontWeight: '500',
    fontSize: 15,
  },
  linkTextBold: {
    fontWeight: '700',
  },
});