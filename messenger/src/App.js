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
} from "reactstrap";
import ClientSocket from "socket.io-client";
import Cookies from "js-cookie";
import Select from "react-select";

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
    const { user, text } = message;
    const curUser = this.props.currentUser;
    const whoseMessage =
      user.username === curUser.username
        ? "Messages-message curUser"
        : "Messages-message";
    return (
      <li className={whoseMessage}>
        <span className="profilePic" style={{ backgroundColor: user.colour }} />
        <div className="Message-content">
          <div className="username">{user.username}</div>
          <div className="text">{text}</div>
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

//TODO: Retrieve all chat ids initially before sending messages
class App extends React.Component {
  constructor(props) {
    super(props);
    this.socket = new ClientSocket();
    this.toggle = this.toggle.bind(this);

    this.socket.on('receiveMessage', (msg) => {
      const messages = this.state.messages;
      messages.push({
        text: msg,
        user: this.state.user
      });
      this.setState({ messages: messages }); 
      var element = document.getElementById('Messages-list');
      element.scrollTop = element.scrollHeight - element.clientHeight;
    });

    this.socket.on('initializeSearch', result => {
      var index;
      var newList = [];
      for (var i = 0; i < result.length; i++) {
        if (result[i].user_id === this.state.user.userid) {
          index = i;
        }
        newList.push({value: result[i].user_id, label: result[i].username});
      }
      newList.splice(index, 1)
      this.setState({userList: newList});
      this.socket.emit('initializeChat', {userid: this.state.user.userid});
    });

    this.socket.on('retrieveFirstMessages', (res) => {
      var newFriendsList = [];
      for (var i = 0; i < res.IDs.length; i++) {
        for (var j = 0; j < this.state.userList.length; j++) {
          if (res.IDs[i] === this.state.userList[j].value) {
            newFriendsList.push({username: this.state.userList[j].label, userid: this.state.userList[j].value, chatid: res.userChatIDs[i]});
            break;
          }
        }
      }
      var newMessages = this.state.messages;
      for (var k = 0; k < res.messages.length; k++) {
        if (res.messages[k].user_id === this.state.user.userid) {
          newMessages.push({
            text: res.messages[k].text,
            user: {
              colour: "#008000",
              username: this.state.user.username
            }
          });
        } else {
          newMessages.push({
            text: res.messages[k].text,
            user: {
              colour: "#00FF00",
              username: newFriendsList[0].username
            }
          });
        }
      }
      this.setState({curChatUser: newFriendsList[0].username});
      this.setState({friendsList: newFriendsList});
      this.setState({curChatID: newFriendsList[0].chatid});
    });

    this.socket.on('AddedChat', function (res) {
      //if friendslist length is 1 change curuser and curchatid and update the messages on page (later under all conditions change these)
    })
    //TODO: function will not work with existing chat
    /*
    this.socket.on('AddedChat', (chat) => {
      var updatedFriendsList = this.state.friendsList;
      var UpdatedSelectedUser = this.state.selectedUser;
      updatedFriendsList[updatedFriendsList.length - 1].chatID = chat.chatID;
      UpdatedSelectedUser.chatID = chat.chatID;
      this.setState({selectedUser: UpdatedSelectedUser});
      this.setState({friendsList: updatedFriendsList});
    })
    */

    this.state = {
      messages: [
        {
          text: "test",
          user: {
            colour: "#00FF00",
            username: "user2"
          }
        }
      ],
      user: {
        username: Cookies.get('username'),
        colour: "#008000",
        userid: parseInt(Cookies.get('user_id'))
      },
      dropdownOpen: false,
      friendsList: [],
      userList: [],
      selectedUser: {username: "", userid: -1},
      curChatUser: "",
      curChatID: -1
    };
  }

  //TODO: add functionality to change which chat group the current user is in
  onFriendClick = () => this.setState()

  onSendMessage = message => {
    this.socket.emit('newMessage', {userid: this.state.user.userid, text: message, chatid: this.state.curChatID});
  };

  toggle() {
    this.setState(prevState => ({ 
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  onUserListChange = event => {
    this.setState({selectedUser: {username: event.label, userid: event.value}});
    //Idea for group chat: have two prompts if user already in a chat have second confirm window to add to current chat (and have current chat as active tag under dropdownitem)
    if (window.confirm("Are you sure you would like to add this user?")) {
      this.socket.emit("NewTwoPersonChat", {user2: event.value, user1: this.state.user.userid});
      var newFriendsList = this.state.friendsList;
      newFriendsList.push({username: event.label, userid: event.value});
      if (newFriendsList.length === 1) {
        this.setState({curChatUser: newFriendsList[0].username});
      }
      this.setState({friendsList: newFriendsList});
    }
  }

  render() {
    if (this.state.friendsList.length === 0) {
      return (
        <div>
          <Navbar color="light" light expand="md">
            <NavbarBrand color="black">Aries</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Friends List
                  </DropdownToggle>
                  <DropdownMenu right>
                    {this.state.friendsList.map((user) => <DropdownItem>{user.username}</DropdownItem>)}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </Collapse>
          </Navbar>
          <Select value={this.state.selectedUser.username} placeholder="Find a friend..." onChange={this.onUserListChange} options={this.state.userList}/>
          <h1 className="No-Friends">
            Please add your first friend to begin chatting!
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
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                      Friends List
                    </DropdownToggle>
                    <DropdownMenu right>
                      {this.state.friendsList.map((user) => <DropdownItem>{user.username}</DropdownItem>)}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Nav>
              </Collapse>
            </Navbar>
            <Select value={this.state.selectedUser.username} placeholder="Find a friend..." onChange={this.onUserListChange} options={this.state.userList}/>
          <h1 className="Conversation-friends">
            {this.state.curChatUser}
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
