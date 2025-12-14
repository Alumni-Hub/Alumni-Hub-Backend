const { Pool } = require('pg');
require('dotenv').config();

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('Connecting to database...');
    
    // Remove NOT NULL constraint
    console.log('Removing NOT NULL constraint from email...');
    await pool.query('ALTER TABLE batchmates ALTER COLUMN email DROP NOT NULL');
    console.log('✓ NOT NULL constraint removed');

    // Remove UNIQUE constraint
    console.log('Removing UNIQUE constraint from email...');
    await pool.query('ALTER TABLE batchmates DROP CONSTRAINT IF EXISTS batchmates_email_unique');
    console.log('✓ UNIQUE constraint removed');

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
