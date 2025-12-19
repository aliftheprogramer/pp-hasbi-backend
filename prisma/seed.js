import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // 1. Clean up existing data (optional, careful in prod)
    // await prisma.report.deleteMany();
    // await prisma.article.deleteMany();
    // await prisma.fishReference.deleteMany();
    // await prisma.user.deleteMany();

    // 2. Seed Users
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('password123', saltRounds); // Default password

    const admin = await prisma.user.upsert({
        where: { email: 'admin@mail.com' },
        update: {},
        create: {
            email: 'admin@mail.com',
            name: 'Admin Sungai',
            password: passwordHash,
            role: 'ADMIN',
            avatarUrl: 'https://ui-avatars.com/api/?name=Admin+Sungai&background=0D8ABC&color=fff',
        },
    });

    const user = await prisma.user.upsert({
        where: { email: 'user@mail.com' },
        update: {},
        create: {
            email: 'user@mail.com',
            name: 'Warga Sungai',
            password: passwordHash,
            role: 'USER',
            avatarUrl: 'https://ui-avatars.com/api/?name=Warga+Sungai&background=random',
        },
    });

    console.log({ admin, user });

    // Get local images
    const uploadsDir = path.join(__dirname, '../public/uploads');
    let imageFiles = [];
    try {
        imageFiles = fs.readdirSync(uploadsDir).filter(file => /^Asset\s\d+\.(jpg|jpeg|png|gif|webp)$/i.test(file));
    } catch (e) {
        console.warn('Warning: Could not read uploads directory. Using placeholders.');
    }

    const getRandomImage = () => {
        if (imageFiles.length === 0) return 'https://placehold.co/600x400';
        const randomFile = imageFiles[Math.floor(Math.random() * imageFiles.length)];
        // Encode filenames to handle spaces/special chars in URL
        return `/uploads/${encodeURIComponent(randomFile)}`;
    };

    // 3. Seed Fish References
    const fishData = [
        {
            name: 'Ikan Sapu-sapu',
            scientificName: 'Pterygoplichthys pardalis',
            description: 'Ikan pembersih kaca yang invasif, merusak ekosistem sungai dengan mengeruk dasar sungai.',
            imageUrl: getRandomImage(),
            dangerLevel: 'MEDIUM',
        },
        {
            name: 'Ikan Aligator',
            scientificName: 'Atractosteus spatula',
            description: 'Predator puncak dengan gigi tajam, memangsa ikan lokal dan berbahaya bagi manusia.',
            imageUrl: getRandomImage(),
            dangerLevel: 'HIGH',
        },
        {
            name: 'Arapaima Gigas',
            scientificName: 'Arapaima gigas',
            description: 'Ikan air tawar terbesar di dunia, predator rakus yang menghabiskan sumber daya ikan lokal.',
            imageUrl: getRandomImage(),
            dangerLevel: 'HIGH',
        },
        {
            name: 'Ikan Piranha',
            scientificName: 'Pygocentrus nattereri',
            description: 'Ikan karnivora agresif yang hidup berkelompok, sangat berbahaya bagi biota air lain.',
            imageUrl: getRandomImage(),
            dangerLevel: 'HIGH',
        },
        {
            name: 'Red Devil',
            scientificName: 'Amphilophus labiatus',
            description: 'Sangat agresif dan teritorial, sering membunuh ikan lain di sekitarnya.',
            imageUrl: getRandomImage(),
            dangerLevel: 'MEDIUM',
        },
    ];

    for (const fish of fishData) {
        await prisma.fishReference.create({ data: fish });
    }

    console.log(`Seeded ${fishData.length} fish references.`);

    // 4. Seed Articles
    const articleData = [
        {
            title: 'Bahaya Ikan Invasif bagi Ekosistem Lokal',
            content: 'Ikan invasif adalah spesies pendatang yang dapat menyebabkan kerusakan lingkungan, ekonomi, atau kesehatan manusia. Mereka seringkali tidak memiliki predator alami di lingkungan baru, sehingga populasinya meledak tak terkendali.',
            thumbnailUrl: getRandomImage(),
            sourceUrl: 'https://kkp.go.id',
        },
        {
            title: 'Mengapa Ikan Aligator Dilarang di Indonesia?',
            content: 'Ikan Aligator dilarang dipelihara di Indonesia berdasarkan Peraturan Menteri Kelautan dan Perikanan. Sifatnya yang predator ganas dapat memusnahkan ikan-ikan endemik Indonesia jika terlepas ke perairan umum.',
            thumbnailUrl: getRandomImage(),
            sourceUrl: 'https://news.detik.com',
        },
        {
            title: 'Mengenal Arapaima Gigas, Raksasa Sungai Amazon',
            content: 'Arapaima Gigas bisa tumbuh hingga 3 meter. Jika masuk ke sungai di Indonesia, ia akan menjadi super-predator yang menghabiskan ikan-ikan kecil, mengganggu rantai makanan.',
            thumbnailUrl: getRandomImage(),
            sourceUrl: 'https://nationalgeographic.grid.id',
        },
        {
            title: 'Dampak Pelepasan Ikan Hias ke Sungai',
            content: 'Banyak pemilik ikan hias melepas peliharaannya ke sungai saat sudah bosan atau ikan terlalu besar. Ini adalah praktik berbahaya yang menjadi salah satu penyebab utama penyebaran spesies invasif.',
            thumbnailUrl: getRandomImage(),
            sourceUrl: 'https://wwf.id',
        },
        {
            title: 'Cara Melaporkan Penemuan Ikan Invasif',
            content: 'Jika Anda menemukan ikan yang mencurigakan atau diketahui sebagai spesies invasif, segera laporkan melalui aplikasi ini. Foto dan lokasi yang akurat sangat membantu petugas dalam penanganan.',
            thumbnailUrl: getRandomImage(),
            sourceUrl: 'https://bhasbi.app',
        },
    ];

    for (const article of articleData) {
        await prisma.article.create({ data: article });
    }

    console.log(`Seeded ${articleData.length} articles.`);
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
