
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env before importing db
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { pool } from '../db/index.js';
import bcrypt from 'bcryptjs';

async function seedUsers() {
    try {
        const users = [
            { email: 'test_free@example.com', password: 'password', name: 'Free User', tier: 'free' },
            { email: 'test_pro@example.com', password: 'password', name: 'Pro User', tier: 'pro' },
            { email: 'test_pro_plus@example.com', password: 'password', name: 'Pro+ User', tier: 'pro_plus' },
        ];

        console.log('🌱 Seeding users...');

        for (const user of users) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);

            // Check if user exists
            const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', [user.email]);

            if (checkUser.rows.length > 0) {
                console.log(`cw User ${user.email} exists. Updating tier to ${user.tier}...`);
                await pool.query(
                    'UPDATE users SET tier = $1, password_hash = $2 WHERE email = $3',
                    [user.tier, hashedPassword, user.email]
                );
            } else {
                console.log(`🆕 Creating ${user.email} with ${user.tier} tier...`);
                await pool.query(
                    'INSERT INTO users (email, password_hash, name, tier) VALUES ($1, $2, $3, $4)',
                    [user.email, hashedPassword, user.name, user.tier]
                );
            }
        }

        console.log('✅ Seeding complete.');

    } catch (error) {
        console.error('❌ Failed to seed users:', error);
    } finally {
        await pool.end();
    }
}

seedUsers();
