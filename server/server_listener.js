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
                var firstUserMessages = await messagingDB.retrieve_chat_messages(allUserChats[0].chat_id);
                var currentUserIDs = [];
                for (var i = 0; i < allUserChats.length; i++) {
                  currentUserIDs.push(allUserChats[i].user_ids[1]);
                }
                chatIO.to(userIDs[user.userid]).emit('retrieveFirstMessages', {IDs: currentUserIDs, messages: firstUserMessages});
              }
            });

            //Current sample socket event before querying database
            socket.on('newMessage', function (msg) {
              console.log("userid: " + msg.userid + " message: " + msg.text);
              //this.messagingDB.send_message(...)
              chatIO.to(socket.id).emit('receiveMessage', msg.text);
            });

            socket.on('NewTwoPersonChat', function (newChat) {
              var newChatID = messagingDB.create_two_user_chat_group(parseInt(newChat.user1), parseInt(newChat.user2));
              chatIO.to(socket.id).emit('AddedChat', {user2: newChat.user2, chatid:newChatID});
            });
          });

          //Handle io.on('disconnect) here
    }
} 