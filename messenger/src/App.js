import React from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.css";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  NavItem,
  NavLink
} from "reactstrap";
import ClientSocket from "socket.io-client";
import Cookies from "js-cookie";
import Select from "react-select";
import Axios from "axios";

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "" };
  }

  onChange(e) {
    this.setState({ text: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ text: "" });
    this.props.onSendMessage(this.state.text);
  }

  render() {
    return (
      <div className="Input">
        <form onSubmit={e => this.onSubmit(e)}>
          <input
            onChange={e => this.onChange(e)}
            value={this.state.text}
            type="text"
            placeholder="Enter a message..."
            autoFocus="true"
          />
        </form>
      </div>
    );
  }
}

class Messages extends React.Component {
  renderMessage(message) {
    const { user, text, colour } = message;
    const curUser = this.props.currentUser;
    const whoseMessage =
      user.username === curUser.username
        ? "Messages-message curUser"
        : "Messages-message";
    return (
      <li className={whoseMessage}>
        <div className="Message-content">
          <div className="username">{user.username}</div>
          <div className="text" style={{ color: colour }}>
            {text}
          </div>
        </div>
      </li>
    );
  }

  render() {
    const { messages } = this.props;
    return (
      <u1 className="Messages-list" id="Messages-list">
        {messages.map(m => this.renderMessage(m))}
      </u1>
    );
  }
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.socket = new ClientSocket().connect();
    this.toggle = this.toggle.bind(this);
    this.socket.on("newConnectedUser", user => {
      this.socket.emit("addConnectedUser", user);
    });

    this.socket.on("UpdateUserScore", user => {
      var tempUser = this.state.user;
      tempUser.score = user.userScore;
      this.setState({ user: tempUser });
    });

    this.socket.on("UpdateSuggestedUser", user => {
      this.updateSuggestedUser(user.suggestedUser);
    });

    this.socket.on("receiveMessage", msg => {
      const messages = this.state.messages;
      var tempBacklog = this.state.backLog;
      if (msg.userid === this.state.user.userid) {
        messages.push({
          text: msg.text,
          user: this.state.user,
          colour:
            msg.isClassified === 0
              ? "grey"
              : msg.isToxic === 0
              ? "green"
              : "red",
          messageid: msg.messageid
        });
        tempBacklog.push({
          messageid: msg.messageid,
          index: messages.length - 1
        });
      } else {
        for (let i = 0; i < this.state.curChatGroup.userids.length; i++) {
          if (msg.userid === this.state.curChatGroup.userids[i]) {
            messages.push({
              text: msg.text,
              user: {
                username: this.state.curChatGroup.usernames[i]
              },
              colour:
                msg.isClassified === 0
                  ? "grey"
                  : msg.isToxic === 0
                  ? "green"
                  : "red",
              messageid: msg.messageid
            });
            tempBacklog.push({
              messageid: msg.messageid,
              index: messages.length - 1
            });
            break;
          }
        }
      }
      this.setState({ messages: messages });
      this.setState({ backLog: tempBacklog });
      var element = document.getElementById("Messages-list");
      element.scrollTop = element.scrollHeight - element.clientHeight;
    });

    this.socket.on("UpdateMessage", updateStatus => {
      var tempbackLog = this.state.backLog;
      var tempMessages = this.state.messages;
      var message = tempbackLog.shift();
      tempMessages[message.index].colour =
        updateStatus.isClassified === 0
          ? "grey"
          : updateStatus.isToxic === 0
          ? "green"
          : "red";
      this.setState({ messages: tempMessages });
    });

    this.socket.on("initializeSearch", result => {
      var index;
      var newList = [];
      for (var i = 0; i < result.length; i++) {
        if (result[i].user_id === this.state.user.userid) {
          index = i;
        }
        newList.push({ value: result[i].user_id, label: result[i].username });
      }
      newList.splice(index, 1);
      var newUserList = [];
      newUserList.push({ label: "All Users", options: newList });
      this.setState({ userList: newUserList });
      this.socket.emit("initializeChat", { userid: this.state.user.userid });
    });

    this.socket.on("retrieveFirstMessages", res => {
      var newGroupsList = [];
      for (var i = 0; i < res.IDs.length; i++) {
        newGroupsList.push({
          usernames: res.usernames[i],
          userids: res.IDs[i],
          chatid: res.userChatIDs[i]
        });
      }
      var newMessages = this.state.messages;
      for (var k = 0; k < res.messages.length; k++) {
        if (res.messages[k].user_id === this.state.user.userid) {
          newMessages.push({
            text: res.messages[k].text,
            user: {
              username: this.state.user.username
            },
            colour:
              res.messages[k].isClassified === 0
                ? "grey"
                : res.messages[k].isToxic === 0
                ? "green"
                : "red",
            messageid: res.messages[k].message_id
          });
        } else {
          for (let i = 0; i < newGroupsList[0].userids.length; i++) {
            if (newGroupsList[0].userids[i] === res.messages[k].user_id) {
              newMessages.push({
                text: res.messages[k].text,
                user: {
                  username: newGroupsList[0].usernames[i]
                },
                colour:
                  res.messages[k].isClassified === 0
                    ? "grey"
                    : res.messages[k].isToxic === 0
                    ? "green"
                    : "red",
                messageid: res.messages[k].message_id
              });
              break;
            }
          }
        }
      }
      this.setState({ groupsList: newGroupsList });
      this.setState({ messages: newMessages });
      this.setState({
        curChatGroup: {
          usernames: [...newGroupsList[0].usernames],
          userids: [...newGroupsList[0].userids]
        }
      });
      this.setState({ groupsList: newGroupsList });
      this.setState({ curChatID: parseInt(newGroupsList[0].chatid) });
      var element = document.getElementById("Messages-list");
      element.scrollTop = element.scrollHeight - element.clientHeight;
    });

    this.socket.on("retrieveNewChat", res => {
      var newMessages = [];
      for (var k = 0; k < res.messages.length; k++) {
        if (res.messages[k].user_id === this.state.user.userid) {
          newMessages.push({
            text: res.messages[k].text,
            user: {
              username: this.state.user.username
            },
            colour:
              res.messages[k].isClassified === 0
                ? "grey"
                : res.messages[k].isToxic === 0
                ? "green"
                : "red",
            messageid: res.messages[k].message_id
          });
        } else {
          for (let i = 0; i < res.userids.length; i++) {
            if (res.messages[k].user_id === res.userids[i]) {
              newMessages.push({
                text: res.messages[k].text,
                user: {
                  username: res.usernames[i]
                },
                colour:
                  res.messages[k].isClassified === 0
                    ? "grey"
                    : res.messages[k].isToxic === 0
                    ? "green"
                    : "red",
                messageid: res.messages[k].message_id
              });
            }
          }
        }
      }
      this.setState({ messages: newMessages });
      this.setState({
        curChatGroup: { usernames: res.usernames, userids: res.userids }
      });
      this.setState({ curChatID: parseInt(res.chatid) });
      var element = document.getElementById("Messages-list");
      element.scrollTop = element.scrollHeight - element.clientHeight;
    });

    this.socket.on("UpdateGroupsList", res => {
      var updatedGroupsList = this.state.groupsList;
      updatedGroupsList.push({
        usernames: res.usernames,
        userids: res.userids,
        chatid: res.chatid
      });
      this.setState({ groupsList: updatedGroupsList });
      if (this.state.groupsList.length === 1) {
        this.socket.emit("changeChatUser", {
          chatID: this.state.groupsList[0].chatid,
          usernames: this.state.groupsList[0].usernames,
          chatUserIDs: this.state.groupsList[0].userids
        });
      }
    });

    this.socket.on("AddedChat", res => {
      var updatedGroupsList = this.state.groupsList;
      updatedGroupsList.push({
        usernames: res.usernames,
        userids: res.userids,
        chatid: res.chatid
      });
      this.setState({ messages: [] });
      this.setState({
        curChatGroup: {
          usernames: [...res.usernames],
          userids: [...res.userids]
        }
      });
      this.setState({ curChatID: parseInt(res.chatid) });
      this.setState({ groupsList: updatedGroupsList });
    });

    this.socket.on("AddedUser", res => {
      var tempGroupsList = this.state.groupsList;
      if (res.userid === this.state.user.userid) {
        res.usernames.splice(res.usernames.length - 1, 1);
        res.userids.splice(res.userids.length - 1, 1);
        res.usernames.push(res.primaryUsername);
        res.userids.push(res.primaryUserID);
        tempGroupsList.push({
          usernames: res.usernames,
          userids: res.userids,
          chatid: res.chatid
        });
        this.setState({ groupsList: tempGroupsList });
        if (this.state.groupsList.length === 1) {
          this.socket.emit("changeChatUser", {
            chatID: this.state.groupsList[0].chatid,
            usernames: this.state.groupsList[0].usernames,
            chatUserIDs: this.state.groupsList[0].userids
          });
        }
      } else {
        var tempCurChatGroup = this.state.curChatGroup;
        for (let i = 0; i < this.state.groupsList.length; i++) {
          if (res.chatid === this.state.groupsList[i].chatid) {
            tempGroupsList[i].usernames.push(res.username);
            tempGroupsList[i].userids.push(res.userid);
            break;
          }
        }
        if (this.state.curChatID === res.chatid) {
          tempCurChatGroup.usernames.push(res.username);
          tempCurChatGroup.userids.push(res.userid);
        }
        this.setState({ curChatGroup: tempCurChatGroup });
        this.setState({ groupsList: tempGroupsList });
      }
    });

    this.socket.on("RemovedUser", user => {
      var tempGroupsList = this.state.groupsList;
      for (let i = 0; i < this.state.groupsList.length; i++) {
        if (this.state.groupsList[i].chatid === user.chatid) {
          tempGroupsList.splice(i, 1);
          break;
        }
      }
      this.setState({ groupsList: tempGroupsList });
      if (user.chatid === this.state.curChatID && tempGroupsList.length > 0) {
        this.socket.emit("changeChatUser", {
          chatID: tempGroupsList[0].chatid,
          usernames: tempGroupsList[0].usernames,
          chatUserIDs: tempGroupsList[0].userids
        });
      }
    });

    this.socket.on("UpdatedGroup", user => {
      var tempGroupsList = this.state.groupsList;
      var tempChatGroup = this.state.curChatGroup;
      if (this.state.curChatID === user.chatid) {
        for (let i = 0; i < this.state.curChatGroup.userids.length; i++) {
          if (this.state.curChatGroup.userids[i] === user.userid) {
            tempChatGroup.userids.splice(i, 1);
            tempChatGroup.usernames.splice(i, 1);
            break;
          }
        }
        this.setState({ curChatGroup: tempChatGroup });
      }
      for (let i = 0; i < this.state.groupsList.length; i++) {
        if (this.state.groupsList[i].chatid === user.chatid) {
          for (let j = 0; j < this.state.groupsList[i].userids.length; j++) {
            if (this.state.groupsList[i].userids[j] === user.userid) {
              tempGroupsList[i].userids.splice(j, 1);
              tempGroupsList[i].usernames.splice(j, 1);
              break;
            }
          }
        }
      }
      this.setState({ groupsList: tempGroupsList });
    });

    this.state = {
      messages: [],
      user: {
        username: Cookies.get("username"),
        userid: parseInt(Cookies.get("user_id")),
        score: -1
      },
      isOpen: false,
      groupsList: [],
      userList: [],
      selectedUsers: [],
      curChatGroup: { usernames: [], userids: [] },
      curChatID: -1,
      backLog: []
    };
  }

  componentDidMount = () => {
    this.interval = window.setInterval(() => this.updateClassification(), 5000);
  };

  componentWillUnmount = () => {
    clearInterval(this.interval);
  };

  updateClassification = () => {
    if (this.state.backLog.length > 0) {
      this.socket.emit("UpdateMessageStatus", {
        messageid: this.state.backLog[0].messageid,
        primaryUserID: this.state.user.userid,
        suggestedUserID: this.state.userList[0].options[0].value
      });
    }
  };

  updateSuggestedUser = suggestedUser => {
    var newSuggestedUser = {
      label: "Suggested User",
      options: [suggestedUser]
    };
    var newUserList = this.state.userList;
    if (newUserList.length > 1) {
      newUserList[0] = newSuggestedUser;
    } else {
      newUserList.unshift(newSuggestedUser);
    }
    this.setState({ userList: newUserList });
  };

  onGroupClick = event => {
    for (var i = 0; i < this.state.groupsList.length; i++) {
      if (
        this.state.groupsList[i].usernames.join(", ") ===
        event.currentTarget.textContent
      ) {
        var userids = this.state.groupsList[i].userids;
        var usernames = this.state.groupsList[i].usernames;
        break;
      }
    }
    this.socket.emit("changeChatUser", {
      chatUserIDs: userids,
      chatID: event.target.value,
      usernames: usernames
    });
  };

  onSendMessage = message => {
    if (message.length > 0) {
      this.socket.emit("newMessage", {
        userid: this.state.user.userid,
        text: message,
        chatid: this.state.curChatID,
        groupIDs: this.state.curChatGroup.userids,
        suggestedUserID: this.state.userList[0].options[0].value,
        primaryUserID: this.state.user.userid
      });
    }
  };

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  onUserListChange = selectedOptions => {
    this.setState({ selectedUsers: selectedOptions });
  };

  onNewGroupClick = () => {
    if (this.state.selectedUsers.length === 0) {
      window.alert("No users selected!");
    } else {
      if (window.confirm("Would you like to start a new group?")) {
        var userIDs = [];
        var usernames = [];
        for (let i = 0; i < this.state.selectedUsers.length; i++) {
          userIDs.push(this.state.selectedUsers[i].value);
          usernames.push(this.state.selectedUsers[i].label);
        }
        this.socket.emit("NewGroupChat", {
          primaryID: this.state.user.userid,
          userIDs: userIDs,
          usernames: usernames,
          primaryUsername: this.state.user.username
        });
      }
    }
    this.setState({ selectedUsers: [] });
  };

  onAddUserClick = () => {
    if (this.state.selectedUsers.length === 0) {
      window.alert("No users selected!");
    } else if (this.state.selectedUsers.length > 1) {
      window.alert("You can only add a single user at a time!");
    } else {
      if (
        !this.state.curChatGroup.userids.includes(
          this.state.selectedUsers[0].value
        )
      ) {
        if (window.confirm("Would you like to add this user to the chat?")) {
          var tempUsers = this.state.curChatGroup;
          var tempGroupsList = this.state.groupsList;
          tempUsers.usernames.push(this.state.selectedUsers[0].label);
          tempUsers.userids.push(this.state.selectedUsers[0].value);
          for (let i = 0; i < this.state.groupsList.length; i++) {
            if (this.state.groupsList[i].chatid === this.state.curChatID) {
              tempGroupsList[i].userids.push(this.state.selectedUsers[0].value);
              tempGroupsList[i].usernames.push(
                this.state.selectedUsers[0].label
              );
              break;
            }
          }
          this.setState({ groupsList: tempGroupsList });
          this.setState({ curChatUsers: tempUsers });
          this.socket.emit("AddToChat", {
            userid: this.state.selectedUsers[0].value,
            chatID: this.state.curChatID,
            username: this.state.selectedUsers[0].label,
            userids: this.state.curChatGroup.userids,
            usernames: this.state.curChatGroup.usernames,
            primaryUsername: this.state.user.username,
            primaryUserID: this.state.user.userid
          });
        }
      } else {
        window.alert("This user is already in this chat!");
      }
    }
    this.setState({ selectedUsers: [] });
  };

  onDeleteClick = event => {
    if (window.confirm("Are you sure you would like to remove this user?")) {
      this.socket.emit("DeleteUser", {
        curUsersIDs: this.state.curChatGroup.userids,
        curUsernames: this.state.curChatGroup.usernames,
        curChatID: parseInt(this.state.curChatID),
        userid: parseInt(event.target.value)
      });
      if (this.state.curChatGroup.usernames.length === 1) {
        var newGroupsList = this.state.groupsList;
        for (let i = 0; i < this.state.groupsList.length; i++) {
          if (
            this.state.groupsList[i].chatid === parseInt(this.state.curChatID)
          ) {
            newGroupsList.splice(i, 1);
            break;
          }
        }
        if (newGroupsList.length > 0) {
          this.socket.emit("changeChatUser", {
            chatID: newGroupsList[0].chatid,
            usernames: newGroupsList[0].usernames,
            chatUserIDs: newGroupsList[0].userids
          });
        }
      }
      var tempChatGroup = this.state.curChatGroup;
      var tempGroupsList = this.state.groupsList;
      for (let i = 0; i < this.state.curChatGroup.userids.length; i++) {
        if (
          parseInt(event.target.value) === this.state.curChatGroup.userids[i]
        ) {
          tempChatGroup.userids.splice(i, 1);
          tempChatGroup.usernames.splice(i, 1);
          break;
        }
      }
      for (let i = 0; i < this.state.groupsList.length; i++) {
        if (
          this.state.groupsList[i].chatid === parseInt(this.state.curChatID)
        ) {
          for (let j = 0; j < this.state.groupsList[i].userids.length; j++) {
            if (
              parseInt(event.target.value) ===
              this.state.groupsList[i].userids[j]
            ) {
              tempGroupsList[i].userids.splice(j, 1);
              tempGroupsList[i].usernames.splice(j, 1);
              break;
            }
          }
        }
      }
      this.setState({ curChatGroup: tempChatGroup });
      this.setState({ groupsList: tempGroupsList });
    }
  };

  onLogOutClick = () => {
    Cookies.remove("username");
    Cookies.remove("user_id");
    Axios.post("/logout");
    window.location.href = "../";
  };

  renderChatGroup = () => {
    var res = [];
    for (let i = 0; i < this.state.curChatGroup.usernames.length; i++) {
      res.push(
        <DropdownItem
          value={this.state.curChatGroup.userids[i]}
          onClick={this.onDeleteClick}
        >
          {this.state.curChatGroup.usernames[i]}
        </DropdownItem>
      );
    }
    return res;
  };

  render() {
    if (this.state.groupsList.length === 0) {
      return (
        <div>
          <Navbar color="light" light expand="md">
            <NavbarBrand color="black">Aries</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink>
                    Current Toxicity Score: {this.state.user.score}
                  </NavLink>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Groups List
                  </DropdownToggle>
                  <DropdownMenu right>
                    {this.state.groupsList.map(group => (
                      <DropdownItem>{group.usernames.join(", ")}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </UncontrolledDropdown>
                <Button color="light" onClick={this.onNewGroupClick}>
                  Create New Group
                </Button>
                <Button color="light" onClick={this.onLogOutClick}>
                  Log Out
                </Button>
              </Nav>
            </Collapse>
          </Navbar>
          <Select
            isMulti
            defaultValue={this.state.selectedUsers}
            value={this.state.selectedUsers}
            placeholder="Start a new chat or add a user to the current chat..."
            onChange={this.onUserListChange}
            options={this.state.userList}
          />
          <h1 className="No-Friends">
            Please add your first group to begin chatting!
          </h1>
        </div>
      );
    } else {
      return (
        <div className="App">
          <Navbar color="light" light expand="md">
            <NavbarBrand color="black">Aries</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink>
                    Current Toxicity Score: {this.state.user.score}
                  </NavLink>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Groups List
                  </DropdownToggle>
                  <DropdownMenu right>
                    {this.state.groupsList.map(group => (
                      <DropdownItem
                        value={group.chatid}
                        onClick={this.onGroupClick}
                      >
                        {group.usernames.join(", ")}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </UncontrolledDropdown>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Current Group
                  </DropdownToggle>
                  <DropdownMenu right>{this.renderChatGroup()}</DropdownMenu>
                </UncontrolledDropdown>
                <Button color="light" onClick={this.onNewGroupClick}>
                  Create New Group
                </Button>
                <Button color="light" onClick={this.onAddUserClick}>
                  Add to Current Group
                </Button>
                <Button color="light" onClick={this.onLogOutClick}>
                  Log Out
                </Button>
              </Nav>
            </Collapse>
          </Navbar>
          <Select
            isMulti
            defaultValue={this.state.selectedUsers}
            value={this.state.selectedUsers}
            placeholder="Start a new chat or add a user to the current chat..."
            onChange={this.onUserListChange}
            options={this.state.userList}
          />
          <h1 className="Conversation-friends">
            {this.state.curChatGroup.usernames.join(", ")}
          </h1>
          <Messages
            messages={this.state.messages}
            currentUser={this.state.user}
          />
          <Input onSendMessage={this.onSendMessage} />
        </div>
      );
    }
  }
}

export default App;
