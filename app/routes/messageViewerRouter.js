const BaseCrudRouter = require('./baseCrudRouter');
const MessageViewerController = require('../controllers/messageViewerController');

class MessageViewerRouter extends BaseCrudRouter {
}

module.exports = new MessageViewerRouter(MessageViewerController).getRouter();
