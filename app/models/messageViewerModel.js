const mongoose = require('../services/databaseService');
const Schema = mongoose.Schema;

const messageViewerSchema = new Schema({
  chatUserId: {
    type: Schema.Types.ObjectId,
    ref: 'ChatUser',
    required: true,
  },
  messageId: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    required: true,
  },
});

const MessageViewerModel = mongoose.model('MessageViewer', messageViewerSchema);

module.exports = MessageViewerModel;
