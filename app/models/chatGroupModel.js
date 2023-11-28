const mongoose = require('../services/databaseService');
const Schema = mongoose.Schema;

const chatGroupSchema = new Schema({
  name: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'ChatUser',
    required: true,
  },
});

const ChatGroupModel = mongoose.model('ChatGroup', chatGroupSchema);

module.exports = ChatGroupModel;
