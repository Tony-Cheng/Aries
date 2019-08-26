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
            this.loginSystem.retrieve_all_users().then( (result) => {
              chatIO.to(socket.id).emit('initialization', result)
            });
            //Current sample socket event before querying database
            socket.on('newMessage', function (msg) {
              console.log("userid: " + msg.userid + " message: " + msg.text);
              chatIO.to(socket.id).emit('receiveMessage', msg.text);
            });
            /*
            socket.on('NewTwoPersonChat', function (newChat) {
              this.messagingDB.create_two_user_chat_group(newChat.user1.userid, newChat.user2.userid);
            });
            */
          });
    }
} 