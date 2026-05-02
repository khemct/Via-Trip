const bcrypt = require('bcryptjs');

const passwordUtils = {
  hash: async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  },
  
  compare: async (password, hash) => {
    return await bcrypt.compare(password, hash);
  }
};

module.exports = passwordUtils;
