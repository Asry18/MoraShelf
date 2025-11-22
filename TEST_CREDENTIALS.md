# Test User Credentials for MoraShelf

## Pre-existing Test Users (from dummyjson.com)

You can use these pre-existing test users to login directly:

### Test User 1
- **Email/Username:** `[email protected]`
- **Password:** `9uQFF1Lh`
- **Name:** Terry Medhurst

### Test User 2
- **Email/Username:** `[email protected]`
- **Password:** `0lelplR`
- **Name:** Sheilah Medhurst

### Test User 3
- **Email/Username:** `[email protected]`
- **Password:** `OWsTbMUgFc`
- **Name:** Marv Loftin

## How to Test

### Option 1: Login with Existing User
1. Open the app
2. Go to Login screen
3. Enter one of the test emails above
4. Enter the corresponding password
5. Click Login

### Option 2: Register New User
1. Open the app
2. Go to Register screen
3. Fill in:
   - **Name:** Your Full Name (e.g., "John Doe")
   - **Email:** Any valid email format (e.g., "[email protected]")
   - **Password:** At least 6 characters (e.g., "password123")
   - **Confirm Password:** Same as password
4. Click Register
5. You will be automatically logged in after successful registration

## Notes

- The app uses **email as username** for login
- Password must be at least 6 characters
- After successful registration, you'll be automatically logged in
- User's name will appear in the HomeScreen greeting: "Hello, {Name} 👋"
- Authentication state is persisted, so you'll stay logged in after closing the app

## API Endpoints Used

- **Login:** `POST https://dummyjson.com/auth/login`
- **Register:** `POST https://dummyjson.com/users/add` (then auto-login)

## Troubleshooting

If login fails:
- Check your internet connection
- Verify the email and password are correct
- Make sure you're using email format (not just username)
- Try registering a new account instead

