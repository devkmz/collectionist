import { Avatar, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { css, SerializedStyles } from '@emotion/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useUser } from '../UserContext';

const styles = (): SerializedStyles => css`
    height: 40px;
    background: #333;
    color: #fff;

    @media (max-width: 767px) {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1001;
    }

    .container {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    
    .ant-avatar {
        background: #1890ff;
        margin-right: 8px;
        text-transform: uppercase;
    }

    .user-data {
        font-size: 12px;
    }

    .ant-dropdown-trigger {
        margin-left: 16px;
        cursor: pointer;
    }
`;

const TopBar = (): JSX.Element => {
    const { t } = useTranslation();
    const { user, clearUser } = useUser();

    return (
        <div css={styles}>
            <div className="container">
                <Avatar size={24} gap={8}>{ !!user?.id ? user.email?.substring(0, 1) : 'G' }</Avatar>
                <div className="user-data">
                    {
                        user?.id ? (
                            <span>{ user?.email }</span>
                        ) : (
                            <span>{ t('users.profile.guest') } (<Link to="/login">{ t('login.common.link.log-in') }</Link>)</span>
                        )
                    }
                </div>
                {
                    user?.id && (
                        <Dropdown overlay={
                            <Menu>
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
                                    user?.role === 'ADMIN' && (
                                        <Menu.Item
                                            key="settings"
                                        >
                                            { t('settings.title') }
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
                        } trigger={['click']}>
                            <span className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                <DownOutlined />
                            </span>
                        </Dropdown>
                    )
                }
            </div>
        </div>
    )
};

export default TopBar;