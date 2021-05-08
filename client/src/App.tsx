import { message } from 'antd';
import React from 'react';

import { User } from './types/user';
import MainView from './views/MainView';

message.config({
  getContainer: () => document.body
});

const getCurrentUser = (): User => {
  return {
    id: 1,
    username: 'Test',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: '2021-04-08T19:58:32Z',
    role: 'ADMIN'
  }
};

const App = (): JSX.Element => {
  const currentUser: User = getCurrentUser();

  return (
    <MainView user={currentUser} />
  );
}

export default App;
