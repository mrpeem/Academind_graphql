import React, { Component } from 'react';

import './Auth.css';
import AuthContext from '../context/auth-context';

class AuthPage extends Component {
  state = {
    isLogin: true
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailElement = React.createRef();
    this.passwordElement = React.createRef();
  };

  switchModeHander = () => {
    this.setState(prevState => {
      return {isLogin: !prevState.isLogin}
    })
  };

  submitHander = (e) => {
    e.preventDefault();

    const email = this.emailElement.current.value;
    const password = this.passwordElement.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    // login
    let body = {
      query: `
        query Login($email: String!, $password: String!) {
          login( email: $email, password: $password ) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email: email,
        password: password
      }
    };

    // sign up
    if (!this.state.isLogin) {
      body = {
        query: `
          mutation CreateUser($email: String!, $password: String!) {
            createUser(userInput: { email: $email, password: $password }) {
              _id
              email
            }
          }
        `,
        variables: {
          email: email,
          password: password
        }
      };
    }

    fetch('/graphql', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed');
      }
      return res.json();
    })
    .then(res => {
      if (res.data.login.token) {
        const data = res.data.login;
        this.context.login(data.token, data.userId, data.tokenExpiration); 
      }
    })
    .catch(err => {
      console.log(err)
    });

  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHander}>
        <div className="form-control">
          <label htmlFor="email"> Email </label>
          <input type="email" id="email" ref={this.emailElement}/>
        </div>

        <div className="form-control">
          <label htmlFor="password"> Password </label>
          <input type="password" id="password" ref={this.passwordElement}/>
        </div>

        <div className="form-actions">
          <button type="submit"> submit </button>
          <button type="button" onClick={this.switchModeHander}> 
            Switch to {this.state.isLogin ? 'Signup' : 'Login'} 
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;