require('dotenv').config();

module.exports = {
  mongoURI: `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:27017/zenklub-appointments?authSource=admin`
};
