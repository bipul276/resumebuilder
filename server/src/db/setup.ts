import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, query } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
    try {
        console.log('🔄 Reading schema file...');
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('🚀 Running schema migration...');
        // Split by semicolon to run statements individually if needed, 
        // but pg driver can handle multiple statements in one query usually.
        await query(schema);

        console.log('✅ Database setup completed successfully!');

        // Check if any users exist
        const result = await query('SELECT count(*) FROM users');
        console.log(`📊 Current user count: ${result.rows[0].count}`);

    } catch (error) {
        console.error('❌ Database setup failed:', error);
    } finally {
        await pool.end();
    }
}

setupDatabase();
