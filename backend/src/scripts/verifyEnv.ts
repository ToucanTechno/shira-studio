import dotenv from 'dotenv';

// Load env variables
dotenv.config();

console.log('Checking environment variables for authentication:');

// Check SECRET
const secret = process.env['SECRET'];
if (!secret) {
  console.error('❌ SECRET environment variable is missing!');
  console.log('  This is required for JWT token signing/verification');
  console.log('  Add SECRET=your_secret_value to your .env file');
} else {
  console.log('✅ SECRET environment variable is set');
}

// Check DB connection string
const dbConnString = process.env['MONGO_URL'];
if (!dbConnString) {
  console.log('⚠️ MONGO_URL environment variable is not set');
  console.log('  Using default: mongodb://localhost:27017/shira-studio');
} else {
  console.log('✅ MONGO_URL environment variable is set');
}

console.log('\nIf any required variables are missing, please add them to your .env file.');
