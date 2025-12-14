const crypto = require('crypto');

console.log('\n=== Strapi Security Keys for Render Deployment ===\n');
console.log('Copy these values to your Render environment variables:\n');

const keys = {
  'APP_KEYS': `${crypto.randomBytes(16).toString('base64')},${crypto.randomBytes(16).toString('base64')},${crypto.randomBytes(16).toString('base64')},${crypto.randomBytes(16).toString('base64')}`,
  'API_TOKEN_SALT': crypto.randomBytes(16).toString('base64'),
  'ADMIN_JWT_SECRET': crypto.randomBytes(32).toString('base64'),
  'TRANSFER_TOKEN_SALT': crypto.randomBytes(16).toString('base64'),
  'JWT_SECRET': crypto.randomBytes(32).toString('base64'),
  'ENCRYPTION_KEY': crypto.randomBytes(32).toString('hex')
};

for (const [key, value] of Object.entries(keys)) {
  console.log(`${key}=${value}`);
}

console.log('\n=== IMPORTANT: Save these keys securely! ===\n');
