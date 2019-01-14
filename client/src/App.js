import React from 'react';
import { Route, Link, withRouter } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import GoogleLogin from 'react-google-login';

import { AuthConsumer } from './context/Auth';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

import '../node_modules/antd/dist/antd.css';

const { Content, Header, Footer } = Layout;

const AppLayout = (props) => {
  const signIn = async (res, cb) => {
    await cb(res.accessToken);
    props.history.push('/dashboard');
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ padding: 0, height: 'auto' }}>
        <Menu defaultSelectedKeys={[window.location.pathname]} selectedKeys={[window.location.pathname]} mode={'horizontal'} theme={'dark'}>
          <Menu.Item key={'/dashboard'}><Link className="nav-link" to="/dashboard">Dashboard</Link></Menu.Item>
          <Menu.Item key={'/auth'} style={{ float: 'right' }}>{!props.isAuthenticated ?
            <GoogleLogin render={renderProps => (<div onClick={renderProps.onClick}>Sign In with Google</div>)} onSuccess={(res) => signIn(res, props.cb)} onFailure={(res) => signIn(res, props.cb)} clientId="674341471923-8u4fpiigpphs5n14erth2qjru33l1ej0.apps.googleusercontent.com" /> :
            <Link className="nav-link" to="/" onClick={props.signOut}>Sign Out</Link>
          }</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ margin: '16px', overflow: 'initial' }}>
        <Route exact path="/" component={Home} />
        <ProtectedRoute exact path="/dashboard" component={Dashboard} />
      </Content>
      <Footer style={{ textAlign: "center" }}>Ariel Finance</Footer>
    </Layout>
  );
};

export default withRouter(React.forwardRef((props, ref) => (
  <AuthConsumer>
    {({ isAuthenticated, oauthGoogle, signOut }) => <AppLayout {...props} isAuthenticated={isAuthenticated} signOut={signOut} cb={oauthGoogle} ref={ref} />}
  </AuthConsumer>
)));
