# Test User Credentials for MoraShelf

## Pre-existing Test Users (from dummyjson.com)

You can use these pre-existing test users from [dummyjson.com/users](https://dummyjson.com/users) to login directly. **Use the EMAIL address** to login (the app will automatically find the username):

### Test User 1
- **Email:** `[email protected]`
- **Username:** `emilys`
- **Password:** `emilyspass`
- **Name:** Emily Johnson

### Test User 2
- **Email:** `[email protected]`
- **Username:** `michaelw`
- **Password:** `michaelwpass`
- **Name:** Michael Williams

### Test User 3
- **Email:** `[email protected]`
- **Username:** `sophiab`
- **Password:** `sophiabpass`
- **Name:** Sophia Brown

### Test User 4
- **Email:** `[email protected]`
- **Username:** `jamesd`
- **Password:** `jamesdpass`
- **Name:** James Davis

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

- **For pre-existing dummyjson users:** Use the **EMAIL address** to login (the app automatically finds the username)
- **For newly registered users:** Use the email you registered with
- Password must be at least 6 characters
- After successful registration, you'll be automatically logged in
- **Newly registered users are stored locally** - you can login with the same credentials you registered with
- **Pre-existing dummyjson users** can login via API (the app looks up their username by email)
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
- **For newly registered users:** Make sure you're using the exact same email and password you registered with
- **For pre-existing users:** Use the test credentials listed above

## How It Works

The app uses a hybrid authentication approach:
1. **Pre-existing users** (from [dummyjson.com/users](https://dummyjson.com/users)) can login via API
   - The app accepts email addresses for login
   - It automatically looks up the username by email from dummyjson
   - Then uses that username to authenticate via `/auth/login` endpoint
2. **Newly registered users** are stored locally and can login with their registered credentials
3. **Login flow:**
   - First tries to login with email as username (for newly registered users)
   - If that fails, searches dummyjson users by email to find the actual username
   - Then tries to login with the found username
   - If API login fails, checks local storage for newly registered users
4. This ensures both pre-existing and newly registered users can authenticate successfully

