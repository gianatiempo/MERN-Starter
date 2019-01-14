import React from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

let jwtToken = localStorage.getItem('JWT_TOKEN');
try {
  const decodedJwtToken = jwtDecode(jwtToken);
  const now = new Date().getTime();
  if (decodedJwtToken.exp < now) {
    jwtToken = '';
  }
} catch (error) {
  jwtToken = '';
} finally {
  axios.defaults.headers.common['Authorization'] = jwtToken;
}

const AuthContext = React.createContext({
  token: jwtToken,
  isAuthenticated: jwtToken ? true : false,
  oauthGoogle: () => null,
  signOut: () => null,
});

export class AuthProvider extends React.Component {
  state = {
    token: jwtToken,
    isAuthenticated: jwtToken ? true : false,
  }

  oauthGoogle = async (data) => {
    const res = await axios.post('http://localhost:5000/users/oauth/google', { access_token: data });
    localStorage.setItem('JWT_TOKEN', res.data.token);
    axios.defaults.headers.common['Authorization'] = res.data.token;

    this.setState({ token: res.data.token, isAuthenticated: true });
  }

  signOut = () => {
    localStorage.removeItem('JWT_TOKEN');
    axios.defaults.headers.common['Authorization'] = '';

    this.setState({ token: '', isAuthenticated: false });
  }

  render() {
    return (
      <AuthContext.Provider value={{ isAuthenticated: this.state.isAuthenticated, oauthGoogle: this.oauthGoogle, signOut: this.signOut }} >
        {this.props.children}
      </AuthContext.Provider>)
  }
};

export const AuthConsumer = AuthContext.Consumer;