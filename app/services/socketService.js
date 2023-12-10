const { Server } = require('socket.io');
const MessageModel = require('../models/messageModel');
const ChatUserModel = require('../models/chatUserModel');
const authService = require('./authService');
const ChatGroupModel = require('../models/chatGroupModel');

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
    socket.on('message', async (message) => {
      try {    
        const newMessage = new MessageModel({
          messageText: message.messageText,
          senderId: socket.chatUser.id, 
          senderName: socket.chatUser.name, 
          recipientContentType: message.recipientContentType,
          recipientObjectId: message.recipientObjectId,
        });
  
        const savedMessage = await newMessage.save();

        if (message.recipientContentType === 'ChatGroup') {
          this.io.emit('message', savedMessage);
        } else {
          this.io.to(this.userSocketMap[message.recipientObjectId]).emit('message', savedMessage);
          socket.emit('message', savedMessage);
        }

      } catch (error) {
        console.error('Error handling message event:', error.message);
      }
    });

    socket.on('findMessages', async (chatEntity) => {
      try {    

        const chatUserId = socket.chatUser.id;

        let query;

        if (chatEntity.contentType === 'ChatGroup') {
          query = { recipientContentType: chatEntity.contentType, recipientObjectId: chatEntity._id};
        } else if (chatEntity.contentType === 'ChatUser') {
          query = {
            $or: [
              { senderId: chatUserId,  recipientContentType: chatEntity.contentType, recipientObjectId: chatEntity._id},
              { senderId: chatEntity._id, recipientContentType: 'ChatUser', recipientObjectId: chatUserId}
            ]
          };
        } else {
          query = {}
        }

        const foundMessages = await MessageModel.find(query);
        socket.emit('findMessages', foundMessages);
      } catch (error) {
        console.error('Error handling message event:', error.message);
      }
    });
  }

  setupChatUserEvents(socket) {
    socket.on('findChatEntities', async (data) => {
      try {    
        const chatUsers = await ChatUserModel.find({
          name: new RegExp(data.name, "i")
        });
      
        const ChatGroups = await ChatGroupModel.find({
          name: new RegExp(data.name, "i")
        });
      
        const chatUsersWithContentType = chatUsers.map(user => ({
          ...user.toObject(), 
          contentType: "ChatUser"
        }));
      
        const chatGroupsWithContentType = ChatGroups.map(group => ({
          ...group.toObject(), 
          contentType: "ChatGroup"
        }));
      
        const chatEntities = [...chatUsersWithContentType, ...chatGroupsWithContentType];

        socket.emit('findChatEntities', chatEntities);
      } catch (error) {
        console.error('Error handling findChatEntities event:', error);
      }
    });

    socket.on('findTalkedChatUsers', async () => {
      try {
        const chatUserId = socket.chatUser.id;
    
        // Busca mensagens que envolvam o usuário, seja como remetente ou destinatário, e mensagens de grupos
        const foundMessages = await MessageModel.find({
          $or: [
            { senderId: chatUserId },
            { recipientObjectId: chatUserId, recipientContentType: 'ChatUser' },
            { recipientContentType: 'ChatGroup' }
          ]
        }).sort({ sendDate: -1 });
    
        const uniqueEntities = new Map();
    
        foundMessages.forEach(message => {
          let entityId, entityType;
    
          if (message.recipientContentType === 'ChatGroup') {
            entityId = message.recipientObjectId;
            entityType = 'Group';
          } else {
            const isSender = message.senderId.toString() === chatUserId.toString();
            entityId = isSender ? message.recipientObjectId : message.senderId;
            entityType = 'User';
          }
    
          const uniqueKey = `${entityType}:${entityId.toString()}`;
          if (!uniqueEntities.has(uniqueKey)) {
            uniqueEntities.set(uniqueKey, { entityId, entityType, lastMessageDate: message.sendDate });
          }
        });
    
        const sortedUniqueEntities = Array.from(uniqueEntities.values())
          .sort((a, b) => b.lastMessageDate - a.lastMessageDate);
    
        const chatEntities = [];
        for (const { entityId, entityType } of sortedUniqueEntities) {
          let entity;
          if (entityType === 'User') {
            entity = await ChatUserModel.findById(entityId);
            if (entity) {
              entity = entity.toObject();
              entity.contentType = 'ChatUser';
            }
          } else if (entityType === 'Group') {
            entity = await ChatGroupModel.findById(entityId);
            if (entity) {
              entity = entity.toObject();
              entity.contentType = 'ChatGroup';
            }
          }
    
          if (entity) {
            chatEntities.push(entity);
          }
        }
    
        socket.emit('findTalkedChatUsers', chatEntities);
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
