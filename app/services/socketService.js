const { Server } = require('socket.io');
const MessageModel = require('../models/messageModel');
const ChatUserModel = require('../models/chatUserModel');
const authService = require('./authService');

class SocketService {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
      },
    });;

    this.userSocketMap = {};

    this.io.on('connection', (socket) => {  
      this.validateAndDisconnectIfInvalidToken(socket);

      this.setupChatGroupMembershipEvents(socket);
      this.setupMessageEvents(socket);
      this.setupMessageViewerEvents(socket);
      this.setupChatUserEvents(socket);
      socket.on('disconnect', () => {
        console.log(`A client disconnected`);

        if ( socket.hasOwnProperty('chatUser') && this.userSocketMap.hasOwnProperty(socket.chatUser.id)) {
          delete this.userSocketMap[socket.chatUser.id];
        }        

      });
    });
  }

  async validateAndDisconnectIfInvalidToken(socket) {
    const userToken = socket.handshake.auth.authToken;
    try {
        const decodeduserToken = await authService.validateToken(userToken);
        const chatUser = await authService.findOrCreateUser(decodeduserToken);
        socket.chatUser = chatUser;
        this.userSocketMap[chatUser.id] = socket.id;
        socket.emit('setMyUser', chatUser);
        console.log('A client connected with a valid token');
    } catch (error) {
        console.log('Invalid token, disconnecting client');
        socket.disconnect();
    }
  }

  setupChatGroupMembershipEvents(socket) {
    socket.on('chatGroupMembershipEvent', (data) => {
      console.log('Received chatGroupMembership event:', data);
    });
  }

  setupMessageEvents(socket) {
    socket.on('message', async (data) => {
        try {    
          const newMessage = new MessageModel({
            messageText: data.messageText,
            senderId: socket.chatUser.id, 
            senderName: socket.chatUser.name, 
            recipientContentType: data.recipientContentType,
            recipientObjectId: data.recipientObjectId,
          });
    
          const savedMessage = await newMessage.save();

          if (data.recipientObjectId && data.recipientObjectId !== socket.chatUser.id && data.recipientContentType === 'ChatUser') {
            this.io.to(this.userSocketMap[data.recipientObjectId]).emit('message', savedMessage);
          }
          socket.emit('message', savedMessage);
        } catch (error) {
          console.error('Error handling message event:', error.message);
        }
      });

      socket.on('findMessages', async (targetUser) => {
        try {    

          const chatUserId = socket.chatUser.id;

          const foundMessages = await MessageModel.find({
            $or: [
              { senderId: chatUserId,  recipientContentType: targetUser.recipientContentType, recipientObjectId: targetUser.recipientObjectId},
              { senderId: targetUser.recipientObjectId, recipientContentType: 'ChatUser', recipientObjectId: chatUserId}
            ]
          });

          socket.emit('findMessages', foundMessages);
        } catch (error) {
          console.error('Error handling message event:', error.message);
        }
      });
  }

  setupChatUserEvents(socket) {
    socket.on('findChatUsers', async (data) => {
      try {    
        const chatUsers = await ChatUserModel.find({
          name: new RegExp(data.name, "i")
        });
  
        const chatUsersWithOnlineStatus = chatUsers.map(user => {
          const isOnline = this.userSocketMap[user._id] ? true : false;
          return { ...user.toObject(), isOnline };
        });
  
        socket.emit('findChatUsers', chatUsersWithOnlineStatus);
      } catch (error) {
        console.error('Error handling findChatUsers event:', error);
      }
    });
  }
  
  
  setupMessageViewerEvents(socket) {
    socket.on('messageViewerEvent', (data) => {
      console.log('Received messageViewer event:', data);
    });
  }

}

module.exports = SocketService;
