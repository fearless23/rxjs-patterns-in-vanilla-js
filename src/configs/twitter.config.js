const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const API_KEY = process.env.API_KEY;
const API_SECRET_KEY = process.env.API_SECRET_KEY;

const twitterConfig = {
  consumer_key: API_KEY,
  consumer_secret: API_SECRET_KEY,
  access_token: ACCESS_TOKEN,
  access_token_secret: ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
};

module.exports = { twitterConfig };
