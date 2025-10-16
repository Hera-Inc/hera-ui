#!/usr/bin/env node

/**
 * Environment Variables Checker
 * Validates that all required environment variables are set before building
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_WEB3AUTH_CLIENT_ID',
  'NEXT_PUBLIC_CHAIN_ID',
  'NEXT_PUBLIC_CHAIN_NAME',
  'NEXT_PUBLIC_RPC_TARGET',
  'NEXT_PUBLIC_BLOCK_EXPLORER_URL',
  'NEXT_PUBLIC_WILL_CONTRACT_ADDRESS',
];

const missingVars = [];

console.log('🔍 Checking environment variables...\n');

for (const varName of requiredEnvVars) {
  const value = process.env[varName];
  
  if (!value || value === '' || value.includes('your_') || value.includes('_here')) {
    missingVars.push(varName);
    console.log(`❌ ${varName}: Missing or using placeholder value`);
  } else {
    console.log(`✅ ${varName}: Set`);
  }
}

console.log('');

if (missingVars.length > 0) {
  console.error('⚠️  Warning: Some environment variables are missing or using placeholder values:');
  console.error(missingVars.map(v => `   - ${v}`).join('\n'));
  console.error('\nPlease check your .env.local file or Vercel environment variables.');
  console.error('See env.example for reference.\n');
  
  // Exit with error code if in production or CI environment
  if (process.env.NODE_ENV === 'production' || process.env.CI === 'true' || process.env.VERCEL === '1') {
    console.error('❌ Build failed: Required environment variables are not set.\n');
    process.exit(1);
  } else {
    console.log('⚠️  Continuing with build in development mode...\n');
  }
} else {
  console.log('✅ All required environment variables are set!\n');
}

