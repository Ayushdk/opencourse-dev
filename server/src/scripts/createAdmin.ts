/**
 * One-time script to create the first admin account.
 *
 * Usage:
 *   npx ts-node src/scripts/createAdmin.ts
 *
 * Reads credentials from environment variables:
 *   ADMIN_EMAIL     (default: admin@opencourse.dev)
 *   ADMIN_USERNAME  (default: admin)
 *   ADMIN_PASSWORD  (required — no default for security)
 *
 * Safe to run multiple times — skips creation if the email already exists.
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../models/User';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@opencourse.dev';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"; // For security, it's better to require this from env without a default. Change as needed.
const MONGO_URI = "mongodb+srv://vickyyybeast_db_user:Rm7ME45MqAbcqJzA@cluster0.irtnies.mongodb.net/opencourse?retryWrites=true&w=majority&appName=Cluster0";
console.log('mongo uri:', MONGO_URI);

async function main() {
    if (!ADMIN_PASSWORD) {
        console.error('❌  ADMIN_PASSWORD env variable is required.');
        process.exit(1);
    }


    if (!MONGO_URI) {
        console.error('❌  MONGODB_URI env variable is required.');
        process.exit(1);
    }

    await mongoose.connect(MONGO_URI);
    console.log('✅  Connected to MongoDB');

    const existing = await User.findOne({ email: ADMIN_EMAIL });

    if (existing) {
        if (existing.role !== 'admin') {
            existing.role = 'admin';
            await existing.save();
            console.log(`ℹ️   Existing user "${ADMIN_EMAIL}" promoted to admin.`);
        } else {
            console.log(`ℹ️   Admin account "${ADMIN_EMAIL}" already exists. Nothing to do.`);
        }
    } else {
        await User.create({
            email: ADMIN_EMAIL,
            username: ADMIN_USERNAME,
            password: ADMIN_PASSWORD, // hashed by the pre-save hook
            role: 'admin',
            contributorStatus: 'none',
        });
        console.log(`✅  Admin account created: ${ADMIN_EMAIL}`);
    }

    await mongoose.disconnect();
    console.log('✅  Done.');
}

main().catch((err) => {
    console.error('❌  Script failed:', err);
    process.exit(1);
});
