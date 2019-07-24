import React from "react";
//import logo from './logo.svg';
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.css";

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
  state = {
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
  render() {
    return (
      <div className="App">
        <Messages 
          messages={this.state.messages}
          currentUser={this.state.user}/>
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
