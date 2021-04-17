import { Layout } from 'antd';
import { css, SerializedStyles } from '@emotion/core';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import CollectionList from './Collections/List';
import CollectionSingle from './Collections/Single';
import MobileNavbar from '../components/MobileNavbar';
import Navbar from '../components/Navbar';
import { User } from '../types/user';

const styles = (): SerializedStyles => css`
    height: 100%;

    .ant-layout-content {
        padding: 44px 0;

        @media (max-width: 767px) {
            padding-top: 96px;
        }
    }

    .container {
        width: 1320px;
        margin-left: auto;
        margin-right: auto;

        @media (max-width: 1399px) {
            width: 1140px;
        }

        @media (max-width: 1199px) {
            width: 960px;
        }

        @media (max-width: 991px) {
            width: 720px;
        }

        @media (max-width: 767px) {
            width: 540px;
            padding-left: 15px;
            padding-right: 15px;
        }

        @media (max-width: 575px) {
            width: 100%;
        }
    }

    .top-row {
        display: flex;
        justify-content: space-between;
    }

    .ant-breadcrumb {
        font-size: 20px;
        font-weight: 500;
        margin-bottom: 32px;
    }

    .load-spinner {
        text-align: center;
    }
`;

const { Content } = Layout;

interface Props {
    user?: User;
}

const MainView = ({ user }: Props): JSX.Element => {
    return (
        <Layout css={styles}>
            <Navbar user={user} />
            <MobileNavbar user={user} />
            <Content>
                <div className="container">
                    <Switch>
                        <Route
                            path="/collections"
                            render={() => <CollectionList user={user} />}
                            exact
                        />
                        <Route
                            path="/collections/:id"
                            render={() => <CollectionSingle />}
                            exact
                        />
                        <Route
                            path="/"
                            render={() => <CollectionList user={user} />}
                            exact
                        />
                        <Route render={() => <Redirect to="/" />} />
                    </Switch>
                </div>
            </Content>
        </Layout>
    );
};

export default MainView;