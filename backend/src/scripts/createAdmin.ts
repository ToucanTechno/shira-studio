import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import process from 'process';

// Load env variables
dotenv.config();

// Display usage instructions
console.log('Usage: npx ts-node src/scripts/createAdmin.ts [-f|--force]');
console.log('  -f, --force  Remove existing admin user if one exists');

// Check if force flag is present
const forceFlag = process.argv.includes('-f') || process.argv.includes('--force');

// Connect to MongoDB
let connectionString = process.env['MONGO_URL'] || 'mongodb://localhost:27017/';

// Add shira-studio database name
connectionString += process.env["DB_NAME"] || 'shira-studio';

console.log(`Connecting to MongoDB at: ${connectionString}`);
console.log(`Database name forced to: shira-studio`);

async function createAdmin() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'admin@example.com' });

    if (existingUser) {
      console.log('Admin user exists with role:', existingUser.role);

      if (existingUser.role !== 'admin') {
        console.log('Updating existing user to admin role...');
        existingUser.role = 'admin';
        await existingUser.save();
        console.log('User updated to admin role successfully!');
      } else if (forceFlag) {
        await User.deleteOne({ email: 'admin@example.com' });
        console.log('Existing admin user removed for recreation.');
      } else {
        console.log('Admin user already exists! Use -f flag to force recreation.');
        await mongoose.disconnect();
        return;
      }
    }

    if (!existingUser || forceFlag) {
      // Don't hash the password - let the mongoose pre-save hook handle it
      // The userSchema.pre('save') hook will automatically hash this password

      // Create user with plaintext password - it will be hashed by the schema middleware
      const newAdmin = new User({
        user_name: 'Admin User',
        email: 'admin@example.com',
        password: 'AdminPassword123',  // Will be hashed by the pre-save hook
        role: 'admin'
      });

      await newAdmin.save();
      console.log('Admin user created successfully!');
      console.log('Login credentials:');
      console.log('Email: admin@example.com');
      console.log('Password: AdminPassword123');

      // Verify by finding the user again
      const verifiedAdmin = await User.findOne({ email: 'admin@example.com' });
      if (verifiedAdmin) {
        console.log('\nVerification successful - Admin user exists in database');
        console.log('Admin details:', {
          id: verifiedAdmin._id,
          name: verifiedAdmin.user_name,
          email: verifiedAdmin.email,
          role: verifiedAdmin.role
        });
      } else {
        console.error('\nVerification failed - Admin user not found in database');
      }
    }
  } catch (error) {
    console.error('Error creating admin user:');
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

console.log('Creating admin user directly in the database...');
console.log('Use -f or --force flag to remove existing admin and recreate');
createAdmin();