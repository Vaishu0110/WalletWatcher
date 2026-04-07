const multer = require("multer");
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "walletwatcher_profiles",
        allowed_formats: ["jpg", "jpeg", "png"],
    },
});

// const fileFilter = (req, file, cb) => {
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error("Only .jpeg, .jpg and .png formats are allowed"), false);
//     }
// };

const upload = multer({storage});

module.exports = upload;