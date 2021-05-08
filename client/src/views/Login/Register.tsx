import { Button, Form, Input } from 'antd';
import { css, SerializedStyles } from '@emotion/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';

import { useUser } from '../../UserContext';
import CardCentered from '../../components/CardCentered';

const style = (): SerializedStyles => css`
    height: 100%;
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
        margin-top: 45px;

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

const RegisterForm = (): JSX.Element => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const { registerUser } = useUser();
    const history = useHistory();

    const register = (values: any) => {
        registerUser(values.email, values.password, values.confirmPassword, () => history.push('/login'));
    };

    return (
        <div css={style}>
            <CardCentered
                header={t('common.app-name')}
                subheader={t('login.register-form.header')}
                footer={(
                    <Button className="link" type="link">
                        <Link to="/login">{ t('login.common.footer.link.return-to-login') }</Link>
                    </Button>
                )}
            >
                <Form
                    name="register"
                    form={form}
                    layout="vertical"
                    onValuesChange={() => {}}
                    requiredMark={false}
                    onFinish={(values) => register(values)}
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
                        rules={[
                            {
                                required: true,
                                message: t('login.common.form.fields.password.required')
                            },
                            {
                                min: 8,
                                message: t('login.register-form.form.fields.password.min-length')
                            },
                            {
                                max: 16,
                                message: t('login.register-form.form.fields.password.max-length')
                            }
                        ]}
                    >
                        <Input.Password placeholder={t('login.common.form.fields.password.placeholder')} />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        rules={[
                            {
                                required: true,
                                message: t('login.common.form.fields.confirm-password.required')
                            }
                        ]}
                    >
                        <Input.Password placeholder={t('login.common.form.fields.confirm-password.placeholder')} />
                    </Form.Item>
                    <Form.Item>
                        <Button className="submit" type="primary" htmlType="submit">{ t('login.register-form.form.buttons.register') }</Button>
                    </Form.Item>
                </Form>
            </CardCentered>
        </div>
    );
};

export default RegisterForm;