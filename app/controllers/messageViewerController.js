const BaseCrudController = require('./baseCrudController');
const MessageViewerModel = require('../models/messageViewerModel'); 

class MessageViewerController extends BaseCrudController {
}

module.exports = new MessageViewerController(MessageViewerModel);
