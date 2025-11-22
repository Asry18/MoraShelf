import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { register, clearError } from '../../store/slices/authSlice';
import { useTheme } from '../../theme/ThemeContext';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();
  const { theme, isDark } = useTheme();
  const { isAuthenticating, error, user } = useSelector(state => state.auth);

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Navigate to home when user is successfully registered
  useEffect(() => {
    if (user && !isAuthenticating) {
      // Navigation will be handled by AppNavigator based on auth state
    }
  }, [user, isAuthenticating]);

  // Show error alert if registration fails
  useEffect(() => {
    if (error) {
      Alert.alert('Registration Failed', error, [{ text: 'OK' }]);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleRegister = async (values) => {
    try {
      await dispatch(register({ 
        name: values.name, 
        email: values.email, 
        password: values.password 
      })).unwrap();
    } catch (err) {
      // Error is handled by useEffect above
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.formContainer}>
        <Text style={[styles.title, { color: theme.primary }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: theme.textSub }]}>Join MoraShelf today</Text>

        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={RegisterSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>
              <View style={styles.inputWrapper}>
                <Text style={[styles.label, { color: theme.text }]}>Full Name</Text>
                <TextInput
                  style={[styles.input, { 
                    borderColor: theme.border, 
                    color: theme.text,
                    backgroundColor: isDark ? '#2C2C2C' : '#FAFAFA'
                  }]}
                  placeholder="John Doe"
                  placeholderTextColor={theme.textSub}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  autoCapitalize="words"
                />
                {touched.name && errors.name && (
                  <Text style={{ color: theme.error || 'red', fontSize: 12 }}>{errors.name}</Text>
                )}
              </View>

              <View style={styles.inputWrapper}>
                <Text style={[styles.label, { color: theme.text }]}>Email</Text>
                <TextInput
                  style={[styles.input, { 
                    borderColor: theme.border, 
                    color: theme.text,
                    backgroundColor: isDark ? '#2C2C2C' : '#FAFAFA'
                  }]}
                  placeholder="student@uom.lk"
                  placeholderTextColor={theme.textSub}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {touched.email && errors.email && (
                  <Text style={{ color: theme.error || 'red', fontSize: 12 }}>{errors.email}</Text>
                )}
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
                {touched.password && errors.password && (
                  <Text style={{ color: theme.error || 'red', fontSize: 12 }}>{errors.password}</Text>
                )}
              </View>

              <View style={styles.inputWrapper}>
                <Text style={[styles.label, { color: theme.text }]}>Confirm Password</Text>
                <TextInput
                  style={[styles.input, { 
                    borderColor: theme.border, 
                    color: theme.text,
                    backgroundColor: isDark ? '#2C2C2C' : '#FAFAFA'
                  }]}
                  placeholder="******"
                  placeholderTextColor={theme.textSub}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  secureTextEntry
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={{ color: theme.error || 'red', fontSize: 12 }}>{errors.confirmPassword}</Text>
                )}
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
                  <Text style={[styles.buttonText, { color: isDark ? '#000' : '#FFF' }]}>Register</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkButton}>
                <Text style={[styles.linkText, { color: theme.tint }]}>Already have an account? Login</Text>
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