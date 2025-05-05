const redisClient = require('../config/redis');

exports.validateResetToken = async (email, token) => {
  const stored = await redisClient.get(`resetToken:${email}`);
  return stored === token;
};
