import mongoose from 'mongoose';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import FishReference from '../models/FishReference.js';
import Article from '../models/Article.js';
import Report from '../models/Report.js';

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

        // SEED USERS
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@bhasbi.com',
            password: hashedPassword,
            role: 'ADMIN',
            avatarUrl: 'https://ui-avatars.com/api/?name=Admin+User'
        });

        const user = await User.create({
            name: 'Regular User',
            email: 'user@bhasbi.com',
            password: hashedPassword,
            role: 'USER',
            avatarUrl: 'https://ui-avatars.com/api/?name=Regular+User'
        });
        console.log('Users seeded');

        // SEED FISH REFERENCES
        const fishRefs = await FishReference.insertMany([
            {
                name: 'Lionfish',
                scientificName: 'Pterois',
                description: 'Lionfish are venomous marine fish in the genus Pterois.',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Lionfish_2.jpg/1200px-Lionfish_2.jpg',
                dangerLevel: 'HIGH'
            },
            {
                name: 'Stonefish',
                scientificName: 'Synanceia',
                description: 'Stonefish are venomous, dangerous, and fatal to humans.',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Stonefish_in_Egypt.jpg/1200px-Stonefish_in_Egypt.jpg',
                dangerLevel: 'HIGH'
            },
            {
                name: 'Clownfish',
                scientificName: 'Amphiprioninae',
                description: 'Clownfish are small, brightly colored fish.',
                imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Anemonefish_on_Isla_de_Chilo%C3%A9.jpg/1200px-Anemonefish_on_Isla_de_Chilo%C3%A9.jpg',
                dangerLevel: 'LOW'
            }
        ]);
        console.log('Fish References seeded');

        // SEED ARTICLES
        await Article.create({
            title: 'Beware of Lionfish',
            content: 'Lionfish are invasive and dangerous. Do not touch them.',
            thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Lionfish_2.jpg/1200px-Lionfish_2.jpg',
            sourceUrl: 'https://en.wikipedia.org/wiki/Pterois'
        });
        console.log('Articles seeded');

        // SEED REPORTS
        await Report.create({
            userId: user._id,
            fishReferenceId: fishRefs[0]._id, // Lionfish
            description: 'I saw a lionfish near the shore!',
            photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Lionfish_2.jpg/1200px-Lionfish_2.jpg',
            latitude: -6.200000,
            longitude: 106.816666,
            addressText: 'Jakarta, Indonesia',
            status: 'PENDING'
        });
        await Report.create({
            userId: user._id,
            fishReferenceId: fishRefs[1]._id, // Stonefish
            description: 'Dangerous stonefish spotted.',
            photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Stonefish_in_Egypt.jpg/1200px-Stonefish_in_Egypt.jpg',
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
