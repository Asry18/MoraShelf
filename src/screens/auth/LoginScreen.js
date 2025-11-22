import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { loginSuccess } from '../../store/slices/authSlice';
import { colors } from '../../theme/colors';

// Validation Schema
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();

  const handleLogin = (values) => {
    // In a real app, you would send these to a backend.
    // Here, we simulate a successful response.
    const user = {
      name: 'Mora Student',
      email: values.email,
      token: 'mock-jwt-token-123'
    };
    dispatch(loginSuccess(user));
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>MoraShelf</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>
              {/* Email Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="student@uom.lk"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="******"
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry
                />
                {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              {/* Submit Button */}
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkButton}>
                <Text style={styles.linkText}>Don't have an account? Register</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center' },
  formContainer: { padding: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: colors.primary, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textLight, textAlign: 'center', marginBottom: 32 },
  inputWrapper: { marginBottom: 16 },
  label: { fontSize: 14, color: colors.text, marginBottom: 8, fontWeight: '500' },
  input: { 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    borderRadius: 8, 
    padding: 12, 
    fontSize: 16, 
    backgroundColor: '#FAFAFA' 
  },
  errorText: { color: colors.error, fontSize: 12, marginTop: 4 },
  button: { 
    backgroundColor: colors.primary, 
    padding: 16, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 16 
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  linkButton: { marginTop: 16, alignItems: 'center' },
  linkText: { color: colors.secondary, fontWeight: '600' }
});