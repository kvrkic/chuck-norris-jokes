require("dotenv").config();

module.exports = {
    PORT: 3000,
    MONGODB_URL: process.env.MONGODB_URL,

    //bcrypt algorithm strength
    BCRYPT_WORK_FACTOR: 14,

    //mongoose error number
    DUPLICATE_EMAIL_ERROR: 11000,
    
    //private key stored in .env file
    JWT_SIGNING_KEY: process.env.JWT_SIGNING_KEY,
    
    //60*10 = 10 minutes
    JWT_EXPIRY_TIME: 60*10,

    //gmail account needed to sent emails
    GMAIL_ACCOUNT_USERNAME: process.env.GMAIL_ACCOUNT_USERNAME,
    GMAIL_ACCOUNT_PASSWORD: process.env.GMAIL_ACCOUNT_PASSWORD
}