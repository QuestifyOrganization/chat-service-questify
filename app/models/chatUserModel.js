const mongoose = require('../services/databaseService');
const Schema = mongoose.Schema;

const chatUserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    unique: true,
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  }
});

const ChatUserModel = mongoose.model('ChatUser', chatUserSchema);

module.exports = ChatUserModel;