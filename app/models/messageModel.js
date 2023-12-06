const mongoose = require('../services/databaseService');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  messageText: String,
  sendDate: { type: Date, default: Date.now },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'ChatUser',
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  recipientContentType: {
    type: String,
    enum: ['ChatUser', 'ChatGroup'],
    required: true,
  },
  recipientObjectId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

const MessageModel = mongoose.model('Message', messageSchema);

module.exports = MessageModel;
