import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

console.log('--- CLOUDINARY CONFIG DEBUG ---');
console.log('CWD:', process.cwd());
console.log('CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API_KEY:', process.env.CLOUDINARY_API_KEY ? '******' : 'undefined');
console.log('-------------------------------');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;
