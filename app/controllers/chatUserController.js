const BaseCrudController = require('./baseCrudController');
const ChatUserModel = require('../models/chatUserModel'); 

class ChatUserController extends BaseCrudController {
}

module.exports = new ChatUserController(ChatUserModel);