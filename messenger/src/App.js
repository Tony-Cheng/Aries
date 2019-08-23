import React from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import Axios from "axios";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import ClientSocket from "socket.io-client";
import Cookies from "js-cookie";

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
    Axios.post("/messenger", "MEMES").then(res => console.log(res)).catch(err => console.log("FAILED"));
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
        username: "user1",
        colour: "#008000",
        userid: Cookies.get('user_id')
      },
      dropdownOpen: false
    };
  }

  onSendMessage = message => {
    const messages = this.state.messages;
    this.socket.emit('newMessage', {userid: this.state.user.userid, text: message});
    messages.push({
      text: message,
      user: this.state.user
    });
    this.setState({ messages: messages });
  };

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  render() {
    return (
      <div className="App">
        <div className="bg-dark">
          <Navbar color="black" light expand="md">
            <NavbarBrand>Aries</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                  <DropdownToggle className="Friends-list" caret>
                    Friends List
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem>Test</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <input list="friends" type="text" placeholder="Find a friend" />
                <datalist id="friends">
                  <option value="text" />
                </datalist>
              </Nav>
            </Collapse>
          </Navbar>
        </div>
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
