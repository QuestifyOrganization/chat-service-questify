const BaseCrudRouter = require('./baseCrudRouter');
const MessageController = require('../controllers/messageController');

class MessageRouter extends BaseCrudRouter {
}

module.exports = new MessageRouter(MessageController).getRouter();
