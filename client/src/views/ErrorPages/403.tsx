import { Button } from "antd";
import { LockFilled } from '@ant-design/icons';
import { css, SerializedStyles } from "@emotion/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import CardCentered from "../../components/CardCentered";
import { useUserState } from "../../context";

const style = (): SerializedStyles => css`
    height: 100vh;
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 410px;
    background: #f0f2f5;

    .ant-btn {
        width: 100%;
    }

    .ant-card {
        margin-bottom: 0;
        width: 350px;
        height: 450px;
        max-width: 100%;
        max-height: 100%;
        box-shadow: 0px 9px 28px 0px rgba(0,0,0,0.05);
        -webkit-box-shadow: 0px 9px 28px 0px rgba(0,0,0,0.05);
        -moz-box-shadow: 0px 9px 28px 0px rgba(0,0,0,0.05);

        .ant-card-body {
            width: 100%;
            height: 100%;
            padding: 36px;
            position: relative;
            display: flex;
            flex-direction: column;
        }

        h1,
        h2 {
            text-align: center;
        }

        .footer {
            margin-top: auto;
            text-align: center;

            .ant-btn-link {
                line-height: 1;
                height: auto;
                margin-bottom: 5px;

                &:last-of-type {
                    margin-bottom: 0;
                }
            }
        }

        .icon-large {
            font-size: 80px;
            margin: 20px 0;
            color: #1890ff;
        }

        .info {
            text-align: center;
        }
    }
`;

const ErrorPage = (): JSX.Element => {
    const { user } = useUserState();
    const { t } = useTranslation();

    return (
        <div css={style}>
            <CardCentered
                header={t('errorPages.403.header')}
                subheader={t('errorPages.403.subheader')}
                footer={(
                    <>
                        {
                            !user.id ? (
                                <Button type="primary"><Link to="/login">{ t('errorPages.403.content.login-button') }</Link></Button>
                            ) : (
                                <Button type="primary"><Link to="/">{ t('errorPages.403.content.return-button') }</Link></Button>
                            ) 
                        }
                    </>
                )}
            >
                <div className="info">
                    <LockFilled className="icon-large" />
                    <p>{ t('errorPages.403.content.no-permissions-message') }</p>
                    { !user.id && <div>{ t('errorPages.403.content.login-to-continue-message') }</div> }
                </div>
            </CardCentered>
        </div>
    );
};

export default ErrorPage;