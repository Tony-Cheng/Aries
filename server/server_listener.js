module.exports = class {

    constructor(io, messagingDB, loginSystem) {
        this.io = io;
        this.messagingDB = messagingDB;
        this.loginSystem = loginSystem;
    }

    initializeAllListeners() {
        var userIDs = {};
        var socketIDs = {};
        this.io.on('connection', (socket) => {
          console.log("user has connected");
            var chatIO = this.io
            var messagingDB = this.messagingDB

            this.loginSystem.retrieve_all_users().then( (result) => {
              chatIO.to(socket.id).emit('initializeSearch', result)
            });

            socket.on('initializeChat', async function (user) {
              userIDs[user.userid] = socket.id;
              socketIDs[socket.id] = user.userid;
              var allUserChats = await messagingDB.retrieve_chat_groups(socketIDs[socket.id]);
              if (allUserChats.length > 0) {
                //TODO: time currently sorted backwards
                var firstUserMessages = await messagingDB.retrieve_chat_messages(allUserChats[0].chat_id);
                var currentUserIDs = [];
                var chatIDs = [];
                for (var i = 0; i < allUserChats.length; i++) {
                  currentUserIDs.push(allUserChats[i].user_ids[1]);
                  chatIDs.push(allUserChats[i].chat_id);
                }
                chatIO.to(userIDs[user.userid]).emit('retrieveFirstMessages', {IDs: currentUserIDs, messages: firstUserMessages, userChatIDs: chatIDs});
              }
            });

            //Current sample socket event before querying database
            socket.on('newMessage', async function (msg) {
              await messagingDB.send_message(msg.text, msg.userid, msg.chatid);
              chatIO.to(socket.id).emit('receiveMessage', msg.text);
            });

            socket.on('NewTwoPersonChat', async function (newChat) {
              var newChatID = await messagingDB.create_two_user_chat_group(newChat.user1, newChat.user2);
              //TODO: return value, doesExist for group chat later on
              if (typeof newChatID !== "boolean") {
                chatIO.to(socket.id).emit('AddedChat', {doesExist: false, userid: newChat.user2, chatid: newChatID, username: newChat.username});
              } else {
                chatIO.to(socket.id).emit("AddedChat", {doesExist: true});
              }
            });

            socket.on('changeChatUser', async function(user) {
              var newMessages = await messagingDB.retrieve_chat_messages(user.chatID);
              chatIO.to(socket.id).emit('retrieveNewChat', {chatid: user.chatID, messages: newMessages, username: user.username, userid: user.chatUserID});
            });
            
            //TODO: remove user from all lists
            socket.on('disconnect', () => console.log("User has disconnected"));
          }); 
    }
} 