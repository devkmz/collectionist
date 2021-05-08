import { message } from 'antd';
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';

import { useUser } from './UserContext';
import ForgotPassword from './views/Login/ForgotPassword';
import LoginForm from './views/Login/Login';
import RegisterForm from './views/Login/Register';
import MainView from './views/MainView';

message.config({
  getContainer: () => document.body
});

const App = (): JSX.Element => {
  const { user: currentUser, loadUser } = useUser();

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  return (
    <Switch>
      <Route
          path="/collections"
          render={() => <MainView user={currentUser} type={"collections"} />}
          exact
      />
      <Route
          path="/collections/:id"
          render={() => <MainView user={currentUser} type={"collections-single"} />}
          exact
      />
      <Route
          path="/collections/:id/elements/:elementId"
          render={() => <MainView user={currentUser} type={"collection-element-single"} />}
          exact
      />
      {
        currentUser?.role === 'ADMIN' && (
          <Route
              path="/collection-types"
              render={() => <MainView user={currentUser} type={"collection-types"} />}
              exact
          />
        )
      }
      {
        !currentUser && (
          <Route
            path="/register"
            render={() => <RegisterForm />}
            exact
          />
        )
      }
      {
        !currentUser && (
          <Route
            path="/login"
            render={() => <LoginForm />}
            exact
          />
        )
      }
      {
        !currentUser && (
          <Route
            path="/forgot-password"
            render={() => <ForgotPassword />}
            exact
          />
        )
      }
      <Route
          path="/"
          render={() => <MainView user={currentUser} type={"collections"} />}
          exact
      />
    </Switch>
  );
}

export default App;
