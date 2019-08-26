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
      <u1 className="Messages-list">
        {messages.map(m => this.renderMessage(m))}
      </u1>
    );
  }
}

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
    });

    this.socket.on('initialization', (result => {
      var index;
      var newList = [];
      for (var i = 0; i < result.length; i++) {
        if (result[i].user_id == Cookies.get('user_id')) {
          index = i;
        }
        newList.push({value: result[i].user_id, label: result[i].username});
      }
      newList.splice(index, 1)
      this.setState({userList: newList});
    }));

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
        userid: Cookies.get('user_id')
      },
      dropdownOpen: false,
      friendsList: [
        "test"
      ],
      userList: []
    };
  }


  onSendMessage = message => {
    this.socket.emit('newMessage', {userid: this.state.user.userid, text: message});
  };

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  render() {
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
                    {this.state.friendsList.map((username) => <DropdownItem>{username}</DropdownItem>)}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </Collapse>
          </Navbar>
          <Select placeholder="Find a friend..." options={this.state.userList}/>
        <h1 className="Conversation-friends">
          {this.state.messages[0].user.username}
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

export default App;
