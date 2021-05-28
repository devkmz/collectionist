import { message } from 'antd';
import axios from 'axios';
import React from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';

import { useUserState } from './context';
import ErrorPage403 from './views/ErrorPages/403';
import ForgotPassword from './views/Login/ForgotPassword';
import LoginForm from './views/Login/Login';
import RegisterForm from './views/Login/Register';
import MainView from './views/MainView';

message.config({
  getContainer: () => document.body
});

const App = (): JSX.Element => {
  const { user } = useUserState();
  const history = useHistory();

  axios.interceptors.response.use(response => {
      return response;
    }, error => {
      const { status } = error.response;
  
      if (status === 403) {
        history.push('/403');
      }
      
      return Promise.reject(error);
    }
  );

  return (
    <Switch>
      <Route
        path="/403"
        render={() => <ErrorPage403 />}
        exact
      />
      <Route
          path="/collections"
          render={() => <MainView user={user} type={"collections"} />}
          exact
      />
      <Route
          path="/collections/:id"
          render={() => <MainView user={user} type={"collectionsSingle"} />}
          exact
      />
      <Route
          path="/collections/:id/elements/:elementId"
          render={() => <MainView user={user} type={"collectionElementSingle"} />}
          exact
      />
      <Route
          path="/collection-types"
          render={() => user?.role === 'ADMIN' ? (
            <MainView user={user} type={"collectionTypes"} />
          ) : (
            <ErrorPage403 />
          )}
          exact
      />
      <Route
          path="/users"
          render={() => user?.role === 'ADMIN' ? (
            <MainView user={user} type={"users"} />
          ) : (
            <ErrorPage403 />
          )}
          exact
      />
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
