const multer = require("multer");
const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId: "cdw2023-28ddc",
  keyFilename: "src/config/firebase.json",
});

const bucket = storage.bucket("gs://cdw2023-28ddc.appspot.com");

const multerStorage = multer.memoryStorage();

const multerUploads = multer({
  storage: multerStorage,
  fileFilter: function (req, file, cb) {
    // Check that the uploaded file is an image
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
}).single("image");

const uploadToStorage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject("No file uploaded!");
    }

    // Create a unique file name for the uploaded image
    const fileName = Date.now() + "-" + file.originalname;

    // Upload the file to Firebase Cloud Storage
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (err) => {
      console.log(err);
      return reject("Unable to upload image!");
    });

    blobStream.on("finish", async () => {
      // Get the public URL of the uploaded file
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

      return resolve(publicUrl);
    });

    blobStream.end(file.buffer);
  });
};

module.exports = { multerUploads, uploadToStorage };
