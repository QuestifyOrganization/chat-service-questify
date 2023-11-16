const mongoose = require('mongoose')
const dabaseConfig = require('../config/databaseConfig');
const databaseConfig = require('../config/databaseConfig');

const mongoURL = `mongodb://${dabaseConfig.username}:${dabaseConfig.password}@${dabaseConfig.host}:${databaseConfig.port}/`;

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Successful connection to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err.message);
    });

module.exports = mongoose;
