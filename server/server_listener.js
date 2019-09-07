const toxicityStatus = require("./process_messages/toxicity_classification");

module.exports = class {
  constructor(io, messagingDB, loginSystem, scoreSystem) {
    this.io = io;
    this.messagingDB = messagingDB;
    this.loginSystem = loginSystem;
    this.scoreSystem = scoreSystem;
  }

  initializeAllListeners() {
    var userIDs = {};
    var socketIDs = {};

    this.io.on("connection", socket => {
      var chatIO = this.io;
      var messagingDB = this.messagingDB;
      var loginSystem = this.loginSystem;
      var scoreSystem = this.scoreSystem;

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
        var suggestedUser = {
          label: "",
          value: await scoreSystem.recommend_user(user.userid)
        };
        suggestedUser.label = (await loginSystem.retrieve_usernames([
          suggestedUser.value
        ]))[0];
        var userScore = (await scoreSystem.find_user_score(
          user.userid
        )).toFixed(2);
        var allUserChats = await messagingDB.retrieve_chat_groups(user.userid);
        if (allUserChats.length > 0) {
          var firstUserMessages = await messagingDB.retrieve_chat_messages(
            allUserChats[0].chat_id
          );
          var currentUserIDs = [];
          var chatIDs = [];
          var currentUsernames = [];
          //Retrieve all existing group chat userids
          for (var i = 0; i < allUserChats.length; i++) {
            for (var j = 0; j < allUserChats[i].user_ids.length; j++) {
              if (allUserChats[i].user_ids[j] === user.userid) {
                var temp = allUserChats[i].user_ids;
                temp.splice(j, 1);
                var tempUsers = await loginSystem.retrieve_usernames(temp);
                currentUserIDs.push(temp);
                currentUsernames.push(tempUsers);
                break;
              }
            }
            chatIDs.push(allUserChats[i].chat_id);
          }
          chatIO.to(userIDs[user.userid]).emit("retrieveFirstMessages", {
            IDs: currentUserIDs,
            messages: firstUserMessages,
            userChatIDs: chatIDs,
            usernames: currentUsernames,
            suggestedUser: suggestedUser
          });
        }
        chatIO.to(userIDs[user.userid]).emit("UpdateSuggestedUser", {
          suggestedUser: suggestedUser
        });
        chatIO.to(userIDs[user.userid]).emit("UpdateUserScore", {
          userScore: userScore
        });
      });

      socket.on("UpdateMessageStatus", async function(msg) {
        try {
          var status = await messagingDB.classify_message(msg.messageid);
          var isClassified;
          var isToxic;
          if (status === toxicityStatus.UNKNOWN) {
            isClassified = 0;
          } else if (status === toxicityStatus.NOTTOXIC) {
            isClassified = 1;
            isToxic = 0;
          } else {
            isClassified = 1;
            isToxic = 1;
          }
          if (isToxic != null) {
            var newScore = (await scoreSystem.update_score(
              msg.primaryUserID,
              isToxic
            )).toFixed(2);
            var newSuggestedUserID = await scoreSystem.recommend_user(
              msg.primaryUserID
            );
            if (newSuggestedUserID !== msg.suggestedUserID) {
              var newSuggestedUser = {
                label: (await loginSystem.retrieve_usernames([
                  newSuggestedUserID
                ]))[0],
                value: newSuggestedUserID
              };
              chatIO
                .to(userIDs[msg.primaryUserID])
                .emit("UpdateSuggestedUser", {
                  suggestedUser: newSuggestedUser
                });
            }
            chatIO.to(userIDs[msg.primaryUserID]).emit("UpdateUserScore", {
              userScore: newScore
            });
          }
          chatIO.to(userIDs[msg.primaryUserID]).emit("UpdateMessage", {
            messageid: msg.messageid,
            isClassified: isClassified,
            isToxic: isToxic
          });
        } catch (error) {
          console.log(error);
        }
      });

      socket.on("newMessage", async function(msg) {
        chatIO.to(userIDs[msg.userid]).emit("ScrollToBottom");
        var id = await messagingDB.send_message(
          msg.text,
          msg.userid,
          msg.chatid
        );
        for (let i = 0; i < msg.groupIDs.length; i++) {
          chatIO.to(userIDs[msg.groupIDs[i]]).emit("receiveMessage", {
            text: msg.text,
            userid: msg.userid,
            messageid: id,
            isClassified: 0,
            chatid: msg.chatid
          });
        }
        chatIO.to(userIDs[msg.userid]).emit("UpdateMessageID", {
          index: msg.index,
          messageid: id
        });
      });

      socket.on("NewGroupChat", async function(newChat) {
        newChat.userIDs.push(newChat.primaryID);
        newChat.usernames.push(newChat.primaryUsername);
        var newChatID = await messagingDB.create_new_user_chat_group(
          newChat.userIDs
        );
        newChat.userIDs.splice(newChat.userIDs.length - 1, 1);
        newChat.usernames.splice(newChat.usernames.length - 1, 1);
        for (let i = 0; i < newChat.userIDs.length; i++) {
          var tempUserIDs = [];
          var tempUsernames = [];
          for (let j = 0; j < newChat.userIDs.length; j++) {
            if (newChat.userIDs[i] !== newChat.userIDs[j]) {
              tempUserIDs.push(newChat.userIDs[j]);
              tempUsernames.push(newChat.usernames[j]);
            }
          }
          tempUserIDs.push(newChat.primaryID);
          tempUsernames.push(newChat.primaryUsername);
          chatIO.to(userIDs[newChat.userIDs[i]]).emit("UpdateGroupsList", {
            usernames: tempUsernames,
            userids: tempUserIDs,
            chatid: newChatID
          });
        }
        chatIO.to(userIDs[newChat.primaryID]).emit("AddedChat", {
          usernames: newChat.usernames,
          userids: newChat.userIDs,
          chatid: newChatID
        });
      });

      socket.on("changeChatUser", async function(users) {
        var newMessages = await messagingDB.retrieve_chat_messages(
          users.chatID
        );
        chatIO.to(socket.id).emit("retrieveNewChat", {
          chatid: users.chatID,
          messages: newMessages,
          usernames: users.usernames,
          userids: users.chatUserIDs
        });
      });

      socket.on("AddToChat", function(newUser) {
        messagingDB.add_user_to_chat(newUser.userid, parseInt(newUser.chatID));

        for (let i = 0; i < newUser.userids.length; i++) {
          chatIO.to(userIDs[newUser.userids[i]]).emit("AddedUser", {
            userid: newUser.userid,
            chatid: parseInt(newUser.chatID),
            username: newUser.username,
            userids: newUser.userids,
            usernames: newUser.usernames,
            primaryUsername: newUser.primaryUsername,
            primaryUserID: newUser.primaryUserID
          });
        }
      });

      socket.on("DeleteUser", users => {
        messagingDB.remove_user_from_chat(users.userid, users.curChatID);
        for (let i = 0; i < users.curUsersIDs.length; i++) {
          if (users.curUsersIDs[i] === users.userid) {
            chatIO.to(userIDs[users.userid]).emit("RemovedUser", {
              chatid: users.curChatID
            });
          } else {
            chatIO.to(userIDs[users.curUsersIDs[i]]).emit("UpdatedGroup", {
              userids: users.curUsersIDs,
              usernames: users.curUsernames,
              chatid: users.curChatID,
              userid: users.userid
            });
          }
        }
      });

      socket.on("QuitGroup", users => {
        messagingDB.remove_user_from_chat(users.userid, users.curChatID);
        if (users.isLast) {
          chatIO.to(userIDs[users.curUsersIDs[0]]).emit("RemovedUser", {
            chatid: users.curChatID
          });
        } else {
          for (let i = 0; i < users.curUsersIDs.length; i++) {
            chatIO.to(userIDs[users.curUsersIDs[i]]).emit("UpdatedGroup", {
              userids: users.curUsersIDs,
              usernames: users.curUsernames,
              chatid: users.curChatID,
              userid: users.userid
            });
          }
        }
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
