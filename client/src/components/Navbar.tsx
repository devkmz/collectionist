import { Layout } from 'antd';
import { css, SerializedStyles } from '@emotion/core';
import React from 'react';

import MainMenu from './MainMenu';

const styles = (): SerializedStyles => css`
    padding: 0;
    background: #fff;
    height: 80px;
    line-height: 80px;
    box-shadow: 0px 0px 22px 0px rgba(0,0,0,0.11);

    @media (max-width: 767px) {
        display: none;
    }

    .container {
        display: flex;
    }

    h1 {
        margin-right: 30px;
        margin-bottom: 0;
    }

    .ant-menu {
        line-height: 79px;
        border-bottom: none;
    }
`;

const { Header } = Layout;

const Navbar = (): JSX.Element => {
    return (
        <Header className="header" css={styles}>
            <div className="container">
                <h1>Collectionist</h1>
                <MainMenu mode="horizontal" />
            </div>
        </Header>
    );
};

export default Navbar;