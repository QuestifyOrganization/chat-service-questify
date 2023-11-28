const BaseCrudRouter = require('./baseCrudRouter');
const ChatGroupMembershipController = require('../controllers/chatGroupMembershipController');

class ChatGroupMembershipRouter extends BaseCrudRouter {
}

module.exports = new ChatGroupMembershipRouter(ChatGroupMembershipController).getRouter();
