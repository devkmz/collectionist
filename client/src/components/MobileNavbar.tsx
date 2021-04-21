import { Layout, Menu } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { css, SerializedStyles } from '@emotion/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { User } from '../types/user';

const styles = (): SerializedStyles => css`
    display: none;
    padding: 0;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999999;

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

        @media (max-width: 575px) {
            width: 100%;
        }
    }
`;

const { Header } = Layout;

interface Props {
    user?: User;
}

const MobileNavbar = ({ user }: Props): JSX.Element => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { t } = useTranslation();
    
    return (
        <Header className={`header ${isMenuOpen ? `menu-open` : ``}`} css={styles}>
            <div className="bar">
                <div className="container">
                    <h1>Collectionist</h1>
                    <MenuOutlined onClick={() => setIsMenuOpen(prev => !prev)} />
                </div>
            </div>            
            <Menu theme="light">
                <div className="container">
                    <Menu.Item
                        key="collections"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <Link to="/collections">{ t('collections.list.title') }</Link>
                    </Menu.Item>
                    {
                        user?.role === 'ADMIN' && (
                            <Menu.Item
                                key="collection-types"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Link to="/collection-types">Typy kolekcji</Link>
                            </Menu.Item>
                        )
                    }
                    {
                        user?.role === 'ADMIN' && (
                            <Menu.Item
                                key="users"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Link to="/users">Użytkownicy</Link>
                            </Menu.Item>
                        )
                    }
                    {
                        user?.id ? (
                            <Menu.Item
                                key="edit-profile"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <span>Edytuj profil</span>
                            </Menu.Item>
                        ) : (
                            <Menu.Item
                                key="sign-in"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <span>Zaloguj się</span>
                            </Menu.Item>
                        )
                    }
                </div>
            </Menu>
        </Header>
    );
};

export default MobileNavbar;