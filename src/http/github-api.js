const axios = require('axios');
const prdConfig = require('../../project.config');

const githubToken = token => {
  return Buffer.from(token, 'base64').toString();
};
let token = githubToken(prdConfig.token);

export default axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3.html',
    // 'X-RateLimit-Limit': 5000,
    // 'X-RateLimit-Remaining': 4966,
    // 'X-RateLimit-Reset': 1372700873,
    Authorization: `token ${token}`,
  },
});
