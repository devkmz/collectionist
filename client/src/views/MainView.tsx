import { Layout } from 'antd';
import { css, SerializedStyles } from '@emotion/core';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import CollectionList from './Collections/List';
import CollectionSingle from './Collections/Single';
import { User } from '../types/user';

const styles = (): SerializedStyles => css`
    height: 100%;

    .ant-layout-content {
        padding: 44px 0;
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
        }

        @media (max-width: 575px) {
            width: 100%;
            padding-left: 15px;
            padding-right: 15px;
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
`;

const { Content } = Layout;

interface Props {
    user?: User;
}

const MainView = ({ user }: Props): JSX.Element => {
    return (
        <Layout css={styles}>
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
                            render={() => <CollectionList />}
                            exact
                        />
                    </Switch>
                </div>
            </Content>
        </Layout>
    );
};

export default MainView;