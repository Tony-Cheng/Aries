import React from "react";
//import logo from './logo.svg';
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.css";

class Input extends React.Component {

  constructor(props) {
    super(props);
    this.state = {text: ""};
  }

  onChange(e) {
    this.setState({text: e.target.value});
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({text: ""});
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
    const whoseMessage = user.username === curUser.username ? "Messages-message curUser" : "Messages-message";
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
    const {messages} = this.props;
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
        colour: "#008000"
      }
    }
  }

   onSendMessage = (message) => {
    const messages = this.state.messages;
    messages.push({
      text: message,
      user: this.state.user
    });
    this.setState({messages: messages});
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>
            Aries Messenger
          </h1>
        </div>
        <Messages 
          messages={this.state.messages}
          currentUser={this.state.user}/>
        <Input
          onSendMessage={this.onSendMessage}
        />
      </div>
      /*
      <div className="App">
     
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
      */
    );
  }
}

export default App;
