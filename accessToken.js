const axios = require("axios");
const NodeCache = require('node-cache');
const dotenv = require('dotenv');
dotenv.config();

const myCache = new NodeCache();

const generateAndStoreAccessToken = async () => {
  try {
    const resp = await axios.post(
      `${process.env.REFRESH_TOKEN_URL}refresh_token=${process.env.REFRESH_TOKEN}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=refresh_token`
    );
    const accessToken = resp.data.access_token;
    console.log(accessToken)
    if (accessToken) {
      myCache.set('accessToken', accessToken, 57 * 60 * 1000); // Store token for 10 minutes
    } else {
      console.log("No access token received.");
    }
  } catch (err) {
    console.log("Error generating or updating access token:", err);
  }
};

const startTokenRefreshing = () => {
  generateAndStoreAccessToken(); // Initial call to get the token
  setInterval(generateAndStoreAccessToken, 58 * 60 * 1000); // Refresh token at intervals
};

const getAccessToken = () => {
  return myCache.get('accessToken');
};

startTokenRefreshing(); // Automatically start refreshing the token

module.exports = {
  startTokenRefreshing,
  getAccessToken
};
