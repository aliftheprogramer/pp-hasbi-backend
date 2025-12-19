import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import FishReference from '../models/FishReference.js';
import Article from '../models/Article.js';
import Report from '../models/Report.js';

import cloudinary from '../config/cloudinary.js';

const uploadToCloudinary = async (url, publicId) => {
    try {
        console.log(`Uploading ${url} to Cloudinary...`);
        const result = await cloudinary.uploader.upload(url, {
            folder: 'bhasbi-seeds',
            public_id: publicId
        });
        return result.secure_url;
    } catch (error) {
        console.error(`Failed to upload ${url}`);
        console.error('Error details:', error);
        return url; // Fallback to original URL if upload fails
    }
};

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('MongoDB Connected for Seeding');

        // Clear existing data
        await User.deleteMany({});
        await FishReference.deleteMany({});
        await Article.deleteMany({});
        await Report.deleteMany({});
        console.log('Old data cleared');

        // Hash password
        const hashedPassword = await bcrypt.hash('123456', 10);

        // Upload Avatars
        const adminAvatar = await uploadToCloudinary('https://ui-avatars.com/api/?name=Admin+User', 'admin-avatar');
        const userAvatar = await uploadToCloudinary('https://ui-avatars.com/api/?name=Regular+User', 'user-avatar');

        // SEED USERS
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@bhasbi.com',
            password: hashedPassword,
            role: 'ADMIN',
            avatarUrl: adminAvatar
        });

        const user = await User.create({
            name: 'Regular User',
            email: 'user@bhasbi.com',
            password: hashedPassword,
            role: 'USER',
            avatarUrl: userAvatar
        });
        console.log('Users seeded');

        // Upload Fish Images
        // Using local images from image/UI PUI
        // Note: Paths are relative to CWD (project root) when running via npm run seed
        const lionfishImg = await uploadToCloudinary('./image/UI PUI/Asset 1.png', 'lionfish');
        const stonefishImg = await uploadToCloudinary('./image/UI PUI/Asset 2.png', 'stonefish');
        const clownfishImg = await uploadToCloudinary('./image/UI PUI/Asset 3.png', 'clownfish');

        // SEED FISH REFERENCES
        const fishRefs = await FishReference.insertMany([
            {
                name: 'Lionfish',
                scientificName: 'Pterois',
                description: 'Lionfish are venomous marine fish in the genus Pterois.',
                imageUrl: lionfishImg,
                dangerLevel: 'HIGH'
            },
            {
                name: 'Stonefish',
                scientificName: 'Synanceia',
                description: 'Stonefish are venomous, dangerous, and fatal to humans.',
                imageUrl: stonefishImg,
                dangerLevel: 'HIGH'
            },
            {
                name: 'Clownfish',
                scientificName: 'Amphiprioninae',
                description: 'Clownfish are small, brightly colored fish.',
                imageUrl: clownfishImg,
                dangerLevel: 'LOW'
            }
        ]);
        console.log('Fish References seeded');

        // SEED ARTICLES
        await Article.create({
            title: 'Beware of Lionfish',
            content: 'Lionfish are invasive and dangerous. Do not touch them.',
            thumbnailUrl: lionfishImg, // Reuse upload
            sourceUrl: 'https://en.wikipedia.org/wiki/Pterois'
        });
        console.log('Articles seeded');

        // SEED REPORTS
        await Report.create({
            userId: user._id,
            fishReferenceId: fishRefs[0]._id, // Lionfish
            description: 'I saw a lionfish near the shore!',
            photoUrl: lionfishImg, // Reuse upload
            latitude: -6.200000,
            longitude: 106.816666,
            addressText: 'Jakarta, Indonesia',
            status: 'PENDING'
        });
        await Report.create({
            userId: user._id,
            fishReferenceId: fishRefs[1]._id, // Stonefish
            description: 'Dangerous stonefish spotted.',
            photoUrl: stonefishImg, // Reuse upload
            latitude: -8.409518,
            longitude: 115.188919,
            addressText: 'Bali, Indonesia',
            status: 'APPROVED'
        });
        console.log('Reports seeded');

        console.log('Data seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
