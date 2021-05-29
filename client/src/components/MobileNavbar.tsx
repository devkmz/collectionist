import { Layout } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { css, SerializedStyles } from '@emotion/core';
import React, { useState } from 'react';

import MainMenu from './MainMenu';

const styles = (): SerializedStyles => css`
    display: none;
    padding: 0;
    position: fixed;
    top: 40px;
    left: 0;
    right: 0;
    z-index: 1000;

    @media (max-width: 767px) {
        display: block;

        .ant-menu {
            display: none;
        }

        &.menu-open {
            .ant-menu {
                display: block;
            }
        }
    }

    .bar {
        background: #fff;
        height: 64px;
        line-height: 64px;
        box-shadow: 0px 0px 22px 0px rgba(0,0,0,0.11);

        h1 {
            margin-bottom: 0;
        }

        .anticon-menu {
            padding: 10px;
        }

        > .container {
            display: flex;
            justify-content: space-between;
            place-items: center;
        }
    }

    .ant-menu {
        width: 540px;
        margin: 0 auto;
        line-height: 48px;
        position: relative;
        box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.1);
        z-index: -1;

        @media (max-width: 575px) {
            width: 100%;
        }
    }
`;

const { Header } = Layout;

const MobileNavbar = (): JSX.Element => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    return (
        <Header className={`header ${isMenuOpen ? `menu-open` : ``}`} css={styles}>
            <div className="bar">
                <div className="container">
                    <h1>Collectionist</h1>
                    <MenuOutlined onClick={() => setIsMenuOpen(prev => !prev)} />
                </div>
            </div>
            <MainMenu onItemClick={() => setIsMenuOpen(false)} />
        </Header>
    );
};

export default MobileNavbar;