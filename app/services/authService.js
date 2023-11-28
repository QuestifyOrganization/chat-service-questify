const jwtConfig = require('../config/jwtConfig');
const jwt = require('jsonwebtoken');
const AuthError = require('../exceptions/authError');
const ChatUserModel = require('../models/chatUserModel');

class AuthService {

    async findOrCreateUser(decodeduserToken) {
        try {
            let foundChatUser = await ChatUserModel.findOne({ userId: decodeduserToken.id });

            if (!foundChatUser) {
                foundChatUser = await ChatUserModel.create({
                    name: decodeduserToken.name,
                    username: decodeduserToken.username,
                    userId: decodeduserToken.id
                });
            }

            return foundChatUser;
        } catch (error) {
            console.error('Error when searching for/creating user:', error);
        }
    }

    async validateToken(token) {
        try {
            const decodeduserToken = jwt.verify(token, jwtConfig.auth.secret);
            return decodeduserToken;
        } catch (error) {
            throw new AuthError('Invalid token');
        }
    } 
}

module.exports = new AuthService();