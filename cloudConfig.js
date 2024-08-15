const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


// We pass configuration detail in cloudinary.config Configuration is nothing but joining the back end to cloudinary account
cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wonderlust_dev',
      allowedFormat: ["png","jpg","jpeg"]// supports promises as well
    },
  });

  module.exports = {
    cloudinary ,
    storage,
  };