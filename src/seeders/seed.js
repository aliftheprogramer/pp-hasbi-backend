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
        // Mapped to Native Indonesian River Fish
        const tomanImg = await uploadToCloudinary('./image/UI PUI/Asset 1.png', 'toman');
        const buntalImg = await uploadToCloudinary('./image/UI PUI/Asset 2.png', 'buntal_tawar');
        const pariImg = await uploadToCloudinary('./image/UI PUI/Asset 3.png', 'pari_sungai');
        const baungImg = await uploadToCloudinary('./image/UI PUI/Asset 4.png', 'baung');
        const sembilangImg = await uploadToCloudinary('./image/UI PUI/Asset 5.png', 'sembilang');
        const tapahImg = await uploadToCloudinary('./image/UI PUI/Asset 6.png', 'tapah');
        const bagariusImg = await uploadToCloudinary('./image/UI PUI/Asset 7.png', 'bagarius');
        const hampalaImg = await uploadToCloudinary('./image/UI PUI/Asset 8.png', 'hampala');

        // SEED FISH REFERENCES
        const fishRefs = await FishReference.insertMany([
            {
                name: 'Ikan Toman',
                scientificName: 'Channa micropeltes',
                description: 'Ikan Toman adalah spesies gabus raksasa yang agresif. Memiliki gigi tajam dan rahang kuat, dikenal galak saat menjaga anak-anaknya.',
                imageUrl: tomanImg,
                dangerLevel: 'HIGH'
            },
            {
                name: 'Ikan Buntal Air Tawar',
                scientificName: 'Pao / Tetraodon',
                description: 'Buntal air tawar di Indonesia (seperti Buntal Pisang) mengandung racun mematikan (tetrodotoxin) di organ dalamnya. Jangan dikonsumsi sembarangan.',
                imageUrl: buntalImg,
                dangerLevel: 'HIGH'
            },
            {
                name: 'Ikan Sapu-Sapu',
                scientificName: 'Urogymnus polylepis / Himantura',
                description: 'Ditemukan di sungai besar Kalimantan dan Sumatera. Memiliki duri berbisa di pangkal ekor yang dapat menyebabkan luka fatal.',
                imageUrl: pariImg,
                dangerLevel: 'HIGH'
            },
            {
                name: 'Ikan Baung',
                scientificName: 'Hemibagrus',
                description: 'Ikan Baung memiliki patil (duri sirip) yang beracun. Sengatannya menyebabkan bengkak, nyeri hebat, dan demam.',
                imageUrl: baungImg,
                dangerLevel: 'MEDIUM'
            },
            {
                name: 'Ikan Sembilang',
                scientificName: 'Plotosus canius',
                description: 'Sering ditemukan di muara sungai. Patilnya memiliki racun yang sangat kuat dan menyakitkan, bahkan bisa berbahaya bagi jantung.',
                imageUrl: sembilangImg,
                dangerLevel: 'HIGH'
            },
            {
                name: 'Ikan Tapah',
                scientificName: 'Wallago leeri',
                description: 'Ikan Tapah adalah "monster sungai" asli Indonesia. Dapat tumbuh sangat besar dan merupakan predator rakus dengan mulut lebar.',
                imageUrl: tapahImg,
                dangerLevel: 'MEDIUM'
            },
            {
                name: 'Ikan Bagarius (Devil Catfish)',
                scientificName: 'Bagarius yarelli',
                description: 'Dikenal sebagai lele setan, ditemukan di Sungai Musi. Memiliki gigi tajam yang tidak biasa untuk jenis lele dan sifat predator agresif.',
                imageUrl: bagariusImg,
                dangerLevel: 'HIGH'
            },
            {
                name: 'Ikan Hampala (Sebarau)',
                scientificName: 'Hampala macrolepidota',
                description: 'Predator air tawar yang berenang cepat. Memiliki tarikan kuat dan gigi tajam, sering menjadi target pemancing namun agresif.',
                imageUrl: hampalaImg,
                dangerLevel: 'LOW'
            }
        ]);
        console.log('Fish References seeded');

        // SEED ARTICLES
        await Article.create({
            title: 'Waspada Ikan Sapu - Sapu',
            content: 'Ikan Sapu - Sapu sering bersembunyi di dasar sungai berlumpur. Tertusuk duri ekornya bisa berakibat fatal. Selalu berhati-hati saat berjalan di sungai keruh.',
            thumbnailUrl: pariImg, // Reuse upload
            sourceUrl: 'https://id.wikipedia.org/wiki/Pari_sungai_raksasa'
        });
        console.log('Articles seeded');

        // SEED REPORTS
        await Report.create({
            userId: user._id,
            fishReferenceId: fishRefs[0]._id, // Toman
            description: 'Induk Toman menyerang perahu nelayan di rawa.',
            photoUrl: tomanImg, // Reuse upload
            latitude: -0.026330,
            longitude: 109.342504,
            addressText: 'Sungai Kapuas, Pontianak',
            status: 'PENDING'
        });
        await Report.create({
            userId: user._id,
            fishReferenceId: fishRefs[2]._id, // Sapu - Sapu
            description: 'Nelayan tidak sengaja menginjak Sapu - Sapu besar.',
            photoUrl: pariImg, // Reuse upload
            latitude: -2.990934,
            longitude: 104.756554,
            addressText: 'Sungai Musi, Palembang',
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
