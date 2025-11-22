import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { login, clearError } from '../../store/slices/authSlice';
import { useTheme } from '../../theme/ThemeContext';
import { LoginSchema } from '../../utils/validation';

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { theme, isDark } = useTheme();
  const { isAuthenticating, error, user } = useSelector(state => state.auth);

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
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
      style={[styles.container, { backgroundColor: theme.background }]} // Dynamic Background
    >
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.navigate('Landing')}
      >
        <Text style={[styles.backButtonText, { color: theme.primary }]}>← Back</Text>
      </TouchableOpacity>
      
      <View style={styles.formContainer}>
        <Text style={[styles.title, { color: theme.primary }]}>MoraShelf</Text>
        <Text style={[styles.subtitle, { color: theme.textSub }]}>Login to continue</Text>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>
              <View style={styles.inputWrapper}>
                <Text style={[styles.label, { color: theme.text }]}>Email or Username</Text>
                <TextInput
                  style={[styles.input, {
                    borderColor: theme.border,
                    color: theme.text,
                    backgroundColor: isDark ? '#2C2C2C' : '#FAFAFA' // Input specific bg
                  }]}
                  placeholder="email@example.com or username"
                  placeholderTextColor={theme.textSub}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {touched.email && errors.email && <Text style={{ color: theme.error || 'red', fontSize: 12 }}>{errors.email}</Text>}
              </View>

              <View style={styles.inputWrapper}>
                <Text style={[styles.label, { color: theme.text }]}>Password</Text>
                <TextInput
                  style={[styles.input, {
                    borderColor: theme.border,
                    color: theme.text,
                    backgroundColor: isDark ? '#2C2C2C' : '#FAFAFA'
                  }]}
                  placeholder="******"
                  placeholderTextColor={theme.textSub}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry
                />
                {touched.password && errors.password && <Text style={{ color: theme.error || 'red', fontSize: 12 }}>{errors.password}</Text>}
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: theme.primary,
                    opacity: isAuthenticating ? 0.6 : 1
                  }
                ]}
                onPress={handleSubmit}
                disabled={isAuthenticating}
              >
                {isAuthenticating ? (
                  <ActivityIndicator size="small" color={isDark ? '#000' : '#FFF'} />
                ) : (
                  <Text style={[styles.buttonText, { color: isDark ? '#000' : '#FFF' }]}>Login</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkButton}>
                <Text style={[styles.linkText, { color: theme.tint }]}>Don't have an account? Register</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  backButton: { 
    position: 'absolute', 
    top: 50, 
    left: 20, 
    zIndex: 10,
    padding: 8,
  },
  backButtonText: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  formContainer: { padding: 24 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 32 },
  inputWrapper: { marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 8, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16
  },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
  linkButton: { marginTop: 16, alignItems: 'center' },
  linkText: { fontWeight: '600' }
});