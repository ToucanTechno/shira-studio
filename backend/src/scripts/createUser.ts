import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import process from 'process';

// Load env variables
dotenv.config();

// Display usage instructions
console.log('Usage: npx ts-node src/scripts/createUser.ts [-f|--force]');
console.log('  -f, --force  Remove existing user if one exists with the same email');

// Check if force flag is present
const forceFlag = process.argv.includes('-f') || process.argv.includes('--force');

// Hardcoded user credentials
const userName = "Test User";
const email = "user@example.com";
const password = "MyPassword123";

// Connect to MongoDB
let connectionString = process.env['MONGO_URL'] || 'mongodb://localhost:27017/';

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