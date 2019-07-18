import React from "react";
//import logo from './logo.svg';
import "./App.css";

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = { userName: props.userName };
  }
  render() {
    return <h1>{this.state.userName}</h1>;
  }
}

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: props.users.map(user => (
        <User key={user.id} userName={user.userName} />
      ))
    };
  }

  render() {
    return <ul>{this.state.users}</ul>;
  }
}

function App() {
  return (
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
    <div>
      <header className="UserList-header">
        <UserList
          users={[
            { key: "memes", userName: "memes" },
            { key: "memes8", userName: "memes8" }
          ]}
        />
      </header>

      <header className="curUser-header"></header>

      <header className="messages-header">
      </header>
    </div>
  );
}

export default App;
