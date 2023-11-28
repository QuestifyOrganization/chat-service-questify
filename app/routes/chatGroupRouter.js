const BaseCrudRouter = require('./baseCrudRouter');
const ChatGroupController = require('../controllers/chatGroupController');

class ChatGroupRouter extends BaseCrudRouter {
}

module.exports = new ChatGroupRouter(ChatGroupController).getRouter();
