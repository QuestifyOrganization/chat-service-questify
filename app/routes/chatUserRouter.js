const BaseCrudRouter = require('./baseCrudRouter');
const ChatUserController = require('../controllers/chatUserController');

class ChatUserRouter extends BaseCrudRouter {
}

module.exports = new ChatUserRouter(ChatUserController).getRouter();