module.exports = class {
  constructor(io, messagingDB, loginSystem) {
    this.io = io;
    this.messagingDB = messagingDB;
    this.loginSystem = loginSystem;
  }

  initializeAllListeners() {
    var userIDs = {};
    var socketIDs = {};

    this.io.on("connection", socket => {
      var chatIO = this.io;
      var messagingDB = this.messagingDB;

      this.loginSystem.retrieve_all_users().then(result => {
        chatIO.to(socket.id).emit("initializeSearch", result);
      });

      socket.on("initializeChat", async function(user) {
        userIDs[user.userid] = socket.id;
        socketIDs[socket.id] = user.userid;
        socket.broadcast.emit("newConnectedUser", {
          userid: user.userid,
          socketid: socket.id
        });
        var allUserChats = await messagingDB.retrieve_chat_groups(user.userid);
        if (allUserChats.length > 0) {
          var firstUserMessages = await messagingDB.retrieve_chat_messages(
            allUserChats[0].chat_id
          );
          var currentUserIDs = [];
          var chatIDs = [];
          for (var i = 0; i < allUserChats.length; i++) {
            for (var j = 0; j < allUserChats[i].user_ids.length; j++) {
              if (allUserChats[i].user_ids[j] !== user.userid) {
                currentUserIDs.push(allUserChats[i].user_ids[j]);
              }
            }
            chatIDs.push(allUserChats[i].chat_id);
          }
          chatIO.to(userIDs[user.userid]).emit("retrieveFirstMessages", {
            IDs: currentUserIDs,
            messages: firstUserMessages,
            userChatIDs: chatIDs
          });
        }
      });

      socket.on("newMessage", async function(msg) {
        var status = await messagingDB.send_message(
          msg.text,
          msg.userid,
          msg.chatid
        );
        if (status === 0) {
          var isClassified = 0;
        } else if (status === 1) {
          var isClassified = 1;
          var isToxic = 0;
        } else {
          var isClassified = 1;
          var isToxic = 1;
        }
        if (msg.userid2 in userIDs) {
          chatIO.to(userIDs[msg.userid]).emit("receiveMessage", {
            text: msg.text,
            userid: msg.userid,
            isClassified: isClassified,
            isToxic: isToxic
          });
          chatIO.to(userIDs[msg.userid2]).emit("receiveMessage", {
            text: msg.text,
            userid: msg.userid,
            isClassified: isClassified,
            isToxic: isToxic
          });
        } else {
          chatIO.to(userIDs[msg.userid]).emit("receiveMessage", {
            text: msg.text,
            userid: msg.userid,
            isClassified: isClassified,
            isToxic: isToxic
          });
        }
      });

      socket.on("NewTwoPersonChat", async function(newChat) {
        var newChatID = await messagingDB.create_two_user_chat_group(
          newChat.user1,
          newChat.user2
        );
        //TODO: return value, doesExist for group chat later on
        if (typeof newChatID !== "boolean") {
          chatIO.to(userIDs[newChat.user1]).emit("AddedChat", {
            doesExist: false,
            userid: newChat.user2,
            chatid: newChatID,
            username: newChat.username1
          });
          chatIO.to(userIDs[newChat.user2]).emit("UpdateFriendsList", {
            userid: newChat.user1,
            chatid: newChatID,
            username: newChat.username2
          });
        } else {
          chatIO.to(socket.id).emit("AddedChat", { doesExist: true });
        }
      });

      socket.on("changeChatUser", async function(user) {
        var newMessages = await messagingDB.retrieve_chat_messages(user.chatID);
        chatIO.to(socket.id).emit("retrieveNewChat", {
          chatid: user.chatID,
          messages: newMessages,
          username: user.username,
          userid: user.chatUserID
        });
      });

      socket.on("addConnectedUser", user => {
        userIDs[user.userid] = user.socketid;
        socketIDs[user.socketid] = user.userid;
      });

      socket.on("disconnect", () => {
        var userid = socketIDs[socket.id];
        delete userIDs[userid];
        delete socketIDs[socket.id];
      });
    });
  }
};
