import { Layout, Menu } from 'antd';
import { css, SerializedStyles } from '@emotion/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useUser } from '../UserContext';
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
    const { clearUser } = useUser();
    
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
                                <Link to="/collection-types">{ t('collectionTypes.list.title') }</Link>
                            </Menu.Item>
                        )
                    }
                    {
                        user?.role === 'ADMIN' && (
                            <Menu.Item
                                key="users"
                            >
                                <Link to="/users">{ t('users.list.title') }</Link>
                            </Menu.Item>
                        )
                    }
                    {
                        user?.id ? (
                            <Menu.Item
                                key="edit-profile"
                            >
                                <span>{ t('users.profile.edit') }</span>
                            </Menu.Item>
                        ) : (  
                            <Menu.Item
                                key="login"
                            >
                                <Link to="/login">{ t('login.common.link.log-in') }</Link>
                            </Menu.Item>
                        )
                    }
                    {
                        user?.id && (
                            <Menu.Item
                                key="logout"
                                onClick={() => clearUser() }
                            >
                                <span>{ t('login.common.link.log-out') }</span>
                            </Menu.Item>
                        )
                    }
                </Menu>
            </div>
        </Header>
    );
};

export default Navbar;