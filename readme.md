# Project Setup Guide

Follow the steps below to set up and run the Node.js application.

## 1. Clone the Repository
```bash
git clone git@github.com:vineetagarwal1352/discordAPI.git
cd discordAPI
```

## 2. Install Node.js Packages
Run the following command to install all required dependencies:
```bash
npm install
```

## 3. Setup the Environment Variables
Create a `.env` file in the root directory and add the following variables:
```
MONGO_URI=<your_mongodb_connection_string>
PORT=3000
HOST=0.0.0.0
JWT_SECRET=qazwsxedcrfvtgbyhnujmikolp0192837465
```

> Replace `<your_mongodb_connection_string>` with your actual MongoDB connection string.

## 4. Start the Server
Start the Node.js server using:
```bash
npm start
```

## 5. Access the API Documentation
Once the server is running, open your browser and go to:
```
http://<HOST>:<PORT>/api-docs
```
Example:
```
http://localhost:3000/api-docs
```

## 6. Using the APIs

1. **Sign Up**:
   - Use the `SignUp` API to create a new user.

2. **Login**:
   - Use the `Login` API to log in and get a token.

3. **Authorize Swagger**:
   - Copy the token from the Login API response.
   - Paste it into the Swagger authorization header.

4. **Use All APIs**:
   - Now you can test all other APIs directly from Swagger.

