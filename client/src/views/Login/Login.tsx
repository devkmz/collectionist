import { Button, Form, Input, message } from 'antd';
import { css, SerializedStyles } from '@emotion/core';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import CardCentered from '../../components/CardCentered';
import { login, useUserDispatch, useUserState } from '../../context';

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
        &.submit {
            width: 100%;
        }
    }

    .ant-form {
        margin-top: 35px;

        .ant-form-item {
            margin-bottom: 28px;

            &:last-child {
                margin-bottom: 0;
            }
        }

        .ant-form-item-with-help {
            margin-bottom: 4px;
        }

        .ant-btn {
            margin-top: 8px;
        }
    }
`;

const LoginForm = (): JSX.Element => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const { loading, error } = useUserState();
    const dispatch = useUserDispatch();

    const handleLogin = () => {
        form.validateFields()
            .then(async (values) => {
                try {
                    await login(dispatch, { email: values.email, password: values.password });
                } catch (errors) {
                    message.error(t('common.messages.error'));
                }
            })
            .catch(errors => {});
    };

    useEffect(() => {
        if (!!error) {
            if (error?.response?.data?.error && error?.response?.data?.error === 'invalid_credentials') {
                message.error(t('login.common.messages.invalid-credentials'));
            } else {
                message.error(t('common.messages.error'))
            }
        }
    }, [error, t]);

    return (
        <div css={style}>
            <CardCentered
                header={t('common.app-name')}
                subheader={t('login.login-form.header')}
                footer={(
                    <>
                        <Button className="link" type="link">
                            <Link to="/register">{ t('login.login-form.footer.link.register') }</Link>
                        </Button>
                        <Button className="link" type="link">
                            <Link to="/forgot-password">{ t('login.login-form.footer.link.forgot-password') }</Link>
                        </Button>
                    </>
                )}
            >
                <Form
                    name="login"
                    form={form}
                    layout="vertical"
                    onValuesChange={() => {}}
                    requiredMark={false}
                    onFinish={handleLogin}
                >
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: t('login.common.form.fields.email.required')
                            },
                            {
                                type: 'email',
                                message: t('login.common.form.fields.email.wrong-format')
                            }
                        ]}
                    >
                        <Input placeholder={t('login.common.form.fields.email.placeholder')} />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{
                            required: true,
                            message: t('login.common.form.fields.password.required')
                        }]}
                    >
                        <Input.Password
                            maxLength={16}
                            placeholder={t('login.common.form.fields.password.placeholder')}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button className="submit" loading={loading} type="primary" htmlType="submit">{ t('login.login-form.form.buttons.login') }</Button>
                    </Form.Item>
                </Form>
            </CardCentered>
        </div>
    );
};

export default LoginForm;