module.exports = class {

    constructor(io, messagingDB, loginSystem) {
        this.io = io;
        this.messagingDB = messagingDB;
        this.loginSystem = loginSystem;
        this.socketIDs = {};
    }

    initializeAllListeners() {
        this.io.on('connection', (socket) => {
            var chatIO = this.io
            var messagingDB = this.messagingDB
            this.loginSystem.retrieve_all_users().then( (result) => {
              chatIO.to(socket.id).emit('initialization', result)
            });
            //Current sample socket event before querying database
            socket.on('newMessage', function (msg) {
              console.log("userid: " + msg.userid + " message: " + msg.text);
              //this.messagingDB.send_message(...)
              chatIO.to(socket.id).emit('receiveMessage', msg.text);
            });

            socket.on('NewTwoPersonChat', function (newChat) {
              var newChatID = messagingDB.create_two_user_chat_group(newChat.user1.userid, newChat.user2.userid);
              chatIO.to(socket.id).emit('AddedChat', {user2: newChat.user2.userid, chatid: newChatID});
            });
          });
    }
} 