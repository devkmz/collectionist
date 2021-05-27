import { Layout } from 'antd';
import { css, SerializedStyles } from '@emotion/core';
import React from 'react';

import MainMenu from './MainMenu';

const styles = (): SerializedStyles => css`
    padding: 0;
    background: #fff;
    height: 80px;
    line-height: 80px;

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