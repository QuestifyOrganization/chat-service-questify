const env = process.env

module.exports = {
    'database': env.MONGO_INITDB_DATABASE,
    'username': env.MONGO_INITDB_ROOT_USERNAME,
    'password': env.MONGO_INITDB_ROOT_PASSWORD,
    'host': env.MONGO_HOST,
    'port': env.MONGO_PORT || 27004
}