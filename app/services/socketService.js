const { Server } = require('socket.io');
const MessageModel = require('../models/messageModel');
const ChatUserModel = require('../models/chatGroupModel');
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
  }

  setupMessageViewerEvents(socket) {
    socket.on('messageViewerEvent', (data) => {
      console.log('Received messageViewer event:', data);
    });
  }

}

module.exports = SocketService;
