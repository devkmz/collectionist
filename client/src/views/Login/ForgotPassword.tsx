import { Button, Typography } from 'antd';
import { css, SerializedStyles } from '@emotion/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import CardCentered from '../../components/CardCentered';

const { Link: LinkAnt } = Typography;

const style = (): SerializedStyles => css`
    height: 100%;
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 410px;
    background: #f0f2f5;

    .info {
        margin-top: 45px;
        text-align: center;
    }

    .mailto-admin {
        font-size: 16px;
        font-weight: 500;
    }
`;

const ForgotPassword = (): JSX.Element => {
    const { t } = useTranslation();

    return (
        <div css={style}>
            <CardCentered
                header={t('common.app-name')}
                subheader={t('login.forgot-password.header')}
                footer={(
                    <Button className="link" type="link">
                        <Link to="/login">{ t('login.common.footer.link.return-to-login') }</Link>
                    </Button>
                )}
            >
                <div className="info">
                    <p>{ t('login.forgot-password.info') }</p>
                    <LinkAnt className="mailto-admin" href="mailto:admin@example.com">admin@example.com</LinkAnt>
                </div>
            </CardCentered>
        </div>
    );
};

export default ForgotPassword;