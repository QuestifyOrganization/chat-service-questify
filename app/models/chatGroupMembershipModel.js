const mongoose = require('../services/databaseService');
const Schema = mongoose.Schema;

const chatGroupMembershipSchema = new Schema({
  entryDate: { type: Date, default: Date.now },
  chatUserId: {
    type: Schema.Types.ObjectId,
    ref: 'ChatUser',
    required: true,
  },
  chatGroupId: {
    type: Schema.Types.ObjectId,
    ref: 'ChatGroup',
    required: true,
  },
});

const ChatGroupMembershipModel = mongoose.model('ChatGroupMembership', chatGroupMembershipSchema);

module.exports = ChatGroupMembershipModel;
