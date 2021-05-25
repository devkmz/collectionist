import 'antd/dist/antd.css';
import plPL from 'antd/lib/locale/pl_PL';
import { ConfigProvider } from 'antd';
import moment from 'moment';
import 'moment/locale/pl';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { UserProvider } from './context';
import './index.css';
import './i18n';

moment.locale('pl');

ReactDOM.render(
  <UserProvider>
    <BrowserRouter>
      <ConfigProvider locale={plPL}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </UserProvider>,
  document.getElementById('root')
);