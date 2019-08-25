module.exports = class {

    constructor(io) {
        this.io = io;
        this.socketIDs = {};
    }

    initializeAllListeners() {
        this.io.on('connection', (socket) => {
            var chatIO = this.io
            //Current sample socket event before querying database
            socket.on('newMessage', function (msg) {
              console.log("userid: " + msg.userid + " message: " + msg.text);
              chatIO.to(socket.id).emit('receiveMessage', msg.text);
            });
          });
    }
}