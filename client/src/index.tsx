import 'antd/dist/antd.css';
import plPL from 'antd/lib/locale/pl_PL';
import { ConfigProvider } from 'antd';
import moment from 'moment';
import 'moment/locale/pl';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import './index.css';
import './i18n';
import reportWebVitals from './reportWebVitals';

moment.locale('pl');

ReactDOM.render(
  <BrowserRouter>
    <ConfigProvider locale={plPL}>
      <App />
    </ConfigProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
