import * as Yup from 'yup';

// Login validation schema - accepts either email or username
export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email or username is required')
    .test('email-or-username', 'Invalid email format', function(value) {
      // Allow either valid email format or any non-empty string (username)
      if (!value) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) || value.length >= 2; // Email format OR at least 2 chars (username)
    }),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

// Registration validation schema
export const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

// Search validation schema (optional, for future use)
export const SearchSchema = Yup.object().shape({
  query: Yup.string()
    .min(2, 'Search query must be at least 2 characters')
    .required('Search query is required'),
});

