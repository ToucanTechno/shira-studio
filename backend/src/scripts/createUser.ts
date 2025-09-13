import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import process from 'process';

// Load env variables
dotenv.config();

// Display usage instructions
console.log('Usage: npx ts-node src/scripts/createUserDirectly.ts <username> <email> <password> [-f|--force]');
console.log('  username     The display name for the user');
console.log('  email        The email address for the user');
console.log('  password     The password for the user');
console.log('  -f, --force  Remove existing user if one exists with the same email');
console.log('');
console.log('Example: npx ts-node src/scripts/createUserDirectly.ts "John Doe" "john@example.com" "MyPassword123"');

// Parse command line arguments
const args = process.argv.slice(2);
const forceFlag = args.includes('-f') || args.includes('--force');
const filteredArgs = args.filter(arg => arg !== '-f' && arg !== '--force');

// Validate arguments
if (filteredArgs.length < 3) {
  console.error('Error: Missing required arguments');
  console.log('Please provide username, email, and password');
  process.exit(1);
}

const [userName, email, password] = filteredArgs;

// Basic validation
if (!userName || !email || !password) {
  console.error('Error: All fields (username, email, password) are required');
  process.exit(1);
}

// Simple email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  console.error('Error: Please provide a valid email address');
  process.exit(1);
}

// Password validation
if (password.length < 6) {
  console.error('Error: Password must be at least 6 characters long');
  process.exit(1);
}

// Connect to MongoDB
let connectionString = process.env['DB_CONN_STRING'] || 'mongodb://localhost:27017/';

// Add shira-studio database name
connectionString += process.env["DB_NAME"] || 'shira-studio';

console.log(`Connecting to MongoDB at: ${connectionString}`);
console.log(`Database name forced to: shira-studio`);

async function createUserDirectly() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      console.log(`User with email ${email} already exists with role:`, existingUser.role);

      if (forceFlag) {
        await User.deleteOne({ email: email });
        console.log('Existing user removed for recreation.');
      } else {
        console.log('User already exists! Use -f flag to force recreation.');
        await mongoose.disconnect();
        return;
      }
    }

    if (!existingUser || forceFlag) {
      // Create user with plaintext password - it will be hashed by the pre-save hook
      const newUser = new User({
        user_name: userName,
        email: email,
        password: password,  // Will be hashed by the pre-save hook
        role: 'user'
      });

      await newUser.save();
      console.log('User created successfully!');
      console.log('Login credentials:');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      console.log(`Username: ${userName}`);

      // Verify by finding the user again
      const verifiedUser = await User.findOne({ email: email });
      if (verifiedUser) {
        console.log('\nVerification successful - User exists in database');
        console.log('User details:', {
          id: verifiedUser._id,
          name: verifiedUser.user_name,
          email: verifiedUser.email,
          role: verifiedUser.role
        });
      } else {
        console.error('\nVerification failed - User not found in database');
      }
    }
  } catch (error) {
    console.error('Error creating user:');
    if (error instanceof Error) {
      console.error(`${error.name}: ${error.message}`);
      console.error(error.stack);
    } else {
      console.error(error);
    }
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
}

console.log(`Creating user "${userName}" with email "${email}"...`);
if (forceFlag) {
  console.log('Force flag detected - will overwrite existing user if present');
}
createUserDirectly();