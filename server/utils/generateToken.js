const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // ৩০ দিনের মেয়াদি সিকিউর টোকেন
  });
};

module.exports = generateToken;