import { Layout } from 'antd';
import { css, SerializedStyles } from '@emotion/core';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import CollectionList from './Collections/List';
import CollectionSingle from './Collections/Single';
import CollectionTypeList from './CollectionTypes/List';
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

    .ant-form-item {
        &.upload {
            .ant-form-item-control {
                max-height: 138px;
            }
        }
    }

    .ant-upload {
        &.ant-upload-select {
            &.ant-upload-select-picture-card {
                width: 100%;
                height: 120px;
            }
        }
    }

    .ant-upload-picture-card-wrapper {
        max-height: 138px;
    }

    .ant-upload-list-picture-card-container {
        width: 100%;
        height: 130px;
    }

    .ant-upload-list-picture-card {
        .ant-upload-list-item {
            padding: 0;
        }
    }

    .ant-upload-list-picture-card .ant-upload-list-item-thumbnail,
    .ant-upload-list-picture-card .ant-upload-list-item-thumbnail img {
        object-fit: cover;
    }

    .upload-button-text {
        font-size: 12px;

        .heading {
            margin-top: 6px;
        }

        .subheading {
            color: rgba(0, 0, 0, 0.65);
        }
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
                            render={() => <CollectionSingle user={user} />}
                            exact
                        />
                        {/* <Route
                            path="/collections/:id/elements/:elementId"
                            render={() => <CollectionElementSingle />}
                            exact
                        /> */}
                        {
                            user?.role === 'ADMIN' && (
                                <Route
                                    path="/collection-types"
                                    render={() => <CollectionTypeList />}
                                    exact
                                />
                            )
                        }
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