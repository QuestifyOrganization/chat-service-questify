const BaseCrudController = require('./baseCrudController');
const ChatGroupMembershipModel = require('../models/chatGroupMembershipModel'); 

class ChatGroupMembershipController extends BaseCrudController {
}

module.exports = new ChatGroupMembershipController(ChatGroupMembershipModel);
