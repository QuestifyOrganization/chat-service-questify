const env = process.env;

module.exports = {
    auth: {
        secret: env.AUTH_SECRET || 'secret',
    }
};