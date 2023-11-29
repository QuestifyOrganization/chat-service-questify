const mongoose = require('mongoose');
const mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl, {
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
