import { Menu, MenuTheme } from 'antd';
import { MenuMode } from 'antd/lib/menu';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { logout, useUserDispatch, useUserState } from '../context';

interface Props {
    theme?: MenuTheme;
    mode?: MenuMode;
    onItemClick?: () => void;
}

const MainMenu = ({ theme = "light", mode = "vertical", onItemClick = () => {} }: Props): JSX.Element => {
    const { t } = useTranslation();
    const { user } = useUserState();
    const dispatch = useUserDispatch();

    return (
        <Menu theme={theme} mode={mode}>
            <Menu.Item
                key="collections"
                onClick={onItemClick}
            >
                <Link to="/collections">{ t('collections.list.title') }</Link>
            </Menu.Item>
            {
                user?.role === 'ADMIN' && (
                    <Menu.Item
                        key="collection-types"
                        onClick={onItemClick}
                    >
                        <Link to="/collection-types">{ t('collectionTypes.list.title') }</Link>
                    </Menu.Item>
                )
            }
            {
                user?.role === 'ADMIN' && (
                    <Menu.Item
                        key="users"
                        onClick={onItemClick}
                    >
                        <Link to="/users">{ t('users.list.title') }</Link>
                    </Menu.Item>
                )
            }
            {
                user?.id ? (
                    <Menu.Item
                        key="logout"
                        onClick={() => {
                            onItemClick();
                            logout(dispatch);
                        }}
                    >
                        <span>{ t('login.common.link.log-out') }</span>
                    </Menu.Item>
                ) : (
                    <Menu.Item
                        key="login"
                        onClick={onItemClick}
                    >
                        <Link to="/login">{ t('login.common.link.log-in') }</Link>
                    </Menu.Item>
                )
            }
        </Menu>
    );
};

export default MainMenu;