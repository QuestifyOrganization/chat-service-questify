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
      this.io.emit('onlineChatUsersIds', Object.keys(this.userSocketMap));

      this.setupMessageEvents(socket);
      this.setupMessageViewerEvents(socket);
      this.setupChatUserEvents(socket);
      this.setupDisconectEvents(socket);
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

  setupDisconectEvents(socket){
    socket.on('disconnect', () => {
      console.log(`A client disconnected`);
      this.io.emit('onlineChatUsersIds', Object.keys(this.userSocketMap));
      if ( socket.hasOwnProperty('chatUser') && this.userSocketMap.hasOwnProperty(socket.chatUser.id)) {
        delete this.userSocketMap[socket.chatUser.id];
      }        

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
  
        socket.emit('findChatUsers', chatUsers);
      } catch (error) {
        console.error('Error handling findChatUsers event:', error);
      }
    });

    socket.on('findTalkedChatUsers', async () => {
      try {
        const chatUserId = socket.chatUser.id;
    
        const foundMessages = await MessageModel.find({
          $or: [
            { senderId: chatUserId, recipientContentType: 'ChatUser' },
            { recipientObjectId: chatUserId, recipientContentType: 'ChatUser' }
          ]
        }).sort({ sendDate: -1 });
    
        const uniqueRecipients = new Map();
    
        foundMessages.forEach(message => {
          const isSender = message.senderId.toString() === chatUserId.toString();
          const objectId = isSender ? message.recipientObjectId : message.senderId;
    
          if (!uniqueRecipients.has(objectId.toString())) {
            uniqueRecipients.set(objectId.toString(), message.sendDate);
          }
        });
    
        const sortedUniqueRecipients = Array.from(uniqueRecipients)
          .sort((a, b) => b[1] - a[1]) // Ordena pelo sendDate
          .map(item => item[0]); // Retorna apenas os IDs
    
        const chatUsers = [];
        for (const id of sortedUniqueRecipients) {
          const user = await ChatUserModel.findById(id);
          if (user) chatUsers.push(user);
        }
    
        socket.emit('findTalkedChatUsers', chatUsers);
      } catch (error) {
        console.error('Error handling findTalkedChatUsers event:', error);
      }
    });   
    
    socket.on('currentUserIsOnline', async (chatUserId) => {
      try {    
        const currentUserIsOnline = this.userSocketMap[chatUserId] ? true: false
        socket.emit('currentUserIsOnline', currentUserIsOnline);
      } catch (error) {
        console.error('Error handling currentUserIsOnline event:', error);
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
