const BaseCrudController = require('./baseCrudController');
const MessageModel = require('../models/messageModel'); 

class MessageController extends BaseCrudController {
}

module.exports = new MessageController(MessageModel);
