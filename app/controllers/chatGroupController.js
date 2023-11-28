const BaseCrudController = require('./baseCrudController');
const ChatGroupModel = require('../models/chatGroupModel'); 

class ChatGroupController extends BaseCrudController {
}

module.exports = new ChatGroupController(ChatGroupModel);
