const mongoose = require('mongoose');
const { username, password, host, port } = require('../config/databaseConfig');

const mongoURL = `${process.env.MONGO_URL}` || `mongodb://${username}:${password}@${host}:${port}/`;

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Successful connection to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
    });

module.exports = mongoose;
