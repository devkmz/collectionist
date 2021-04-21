import { Layout, Menu } from 'antd';
import { css, SerializedStyles } from '@emotion/core';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Link } from 'react-router-dom';

import { User } from '../types/user';

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

interface Props {
    user?: User;
}

const Navbar = ({ user }: Props): JSX.Element => {
    const { t } = useTranslation();
    
    return (
        <Header className="header" css={styles}>
            <div className="container">
                <h1>Collectionist</h1>
                <Menu theme="light" mode="horizontal">
                    <Menu.Item
                        key="collections"
                    >
                        <Link to="/collections">{ t('collections.list.title') }</Link>
                    </Menu.Item>
                    {
                        user?.role === 'ADMIN' && (
                            <Menu.Item
                                key="collection-types"
                            >
                                <Link to="/collection-types">Typy kolekcji</Link>
                            </Menu.Item>
                        )
                    }
                    {
                        user?.role === 'ADMIN' && (
                            <Menu.Item
                                key="users"
                            >
                                <Link to="/users">Użytkownicy</Link>
                            </Menu.Item>
                        )
                    }
                    {
                        user?.id ? (
                            <Menu.Item
                                key="edit-profile"
                            >
                                <span>Edytuj profil</span>
                            </Menu.Item>
                        ) : (
                            <Menu.Item
                                key="sign-in"
                            >
                                <span>Zaloguj się</span>
                            </Menu.Item>
                        )
                    }
                </Menu>
            </div>
        </Header>
    );
};

export default Navbar;