import { message } from 'antd';
import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { useUser } from './UserContext';
import ForgotPassword from './views/Login/ForgotPassword';
import LoginForm from './views/Login/Login';
import RegisterForm from './views/Login/Register';
import MainView from './views/MainView';

message.config({
  getContainer: () => document.body
});

const App = (): JSX.Element => {
  const { user, loadUser } = useUser();

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  return (
    <Switch>
      <Route
          path="/collections"
          render={() => <MainView user={user} type={"collections"} />}
          exact
      />
      <Route
          path="/collections/:id"
          render={() => <MainView user={user} type={"collections-single"} />}
          exact
      />
      <Route
          path="/collections/:id/elements/:elementId"
          render={() => <MainView user={user} type={"collection-element-single"} />}
          exact
      />
      {
        user?.role === 'ADMIN' && (
          <Route
              path="/collection-types"
              render={() => <MainView user={user} type={"collection-types"} />}
              exact
          />
        )
      }
      {
        !user?.id && (
          <Route
            path="/register"
            render={() => <RegisterForm />}
            exact
          />
        )
      }
      {
        !user?.id && (
          <Route
            path="/login"
            render={() => <LoginForm />}
            exact
          />
        )
      }
      {
        !user?.id && (
          <Route
            path="/forgot-password"
            render={() => <ForgotPassword />}
            exact
          />
        )
      }
      <Route render={() => <Redirect to="/collections" />} />
    </Switch>
  );
}

export default App;
