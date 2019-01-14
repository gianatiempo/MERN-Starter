import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthConsumer } from '../context/Auth';

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <AuthConsumer>
    {({ isAuthenticated }) => (
      <Route render={props => isAuthenticated ? <Component {...props} /> : <Redirect to="/" />} {...rest} />
    )}
  </AuthConsumer>
);
export default ProtectedRoute;
