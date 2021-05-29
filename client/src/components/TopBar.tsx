import { Avatar, Col, Dropdown, Form, Menu, message, Modal, Radio, Row, Spin } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import axios from 'axios';
import { css, SerializedStyles } from '@emotion/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';

import { logout, useUserDispatch, useUserState } from '../context';

const styles = (): SerializedStyles => css`
    height: 40px;
    background: #333;
    color: #fff;

    @media (max-width: 767px) {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
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

interface Props {
    onProfileEdit: () => void;
}

const { REACT_APP_API_URL } = process.env;

const TopBar = ({ onProfileEdit }: Props): JSX.Element => {
    const { t } = useTranslation();
    const { user } = useUserState();
    const dispatch = useUserDispatch();

    const [settingsForm] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
    const history = useHistory();

    const saveSettings = async (values: any) => {
        try {
            setIsSaving(true);
            await axios.put(`${REACT_APP_API_URL}/access`, values);
            setIsSettingsModalVisible(false);
            message.success(t('settings.edit-success'));
        } catch (error) {
            message.error(t('common.messages.error'));
        } finally {
            setIsSaving(false);
        }
    };

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
                                            onClick={onProfileEdit}
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
                                            onClick={async () => {
                                                try {
                                                    setIsLoading(true);
                                                    setIsSettingsModalVisible(true);
                                                    const response = await axios.get(`${REACT_APP_API_URL}/access`);
                                                    settingsForm.setFieldsValue(!!response.data
                                                        ? { ...response.data, isPublic: !!(response.data as any)['isPublic'] }
                                                        : { isPublic: false });
                                                } catch (error) {
                                                    message.error(t('common.messages.error'));
                                                } finally {
                                                    setIsLoading(false);
                                                }
                                            }}
                                        >
                                            { t('settings.title') }
                                        </Menu.Item>
                                    )
                                }
                                {
                                    user?.id && (
                                        <Menu.Item
                                            key="logout"
                                            onClick={() => {
                                                logout(dispatch);
                                                history.push('/');
                                            }}
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
            <Modal
                title={t('settings.title')}
                visible={isSettingsModalVisible}
                onOk={() => {
                    settingsForm.validateFields()
                    .then(values => {
                        saveSettings({ ...values, isPublic: Number(values.isPublic) });
                    })
                    .catch(error => {});
                }}
                onCancel={() => {
                    setIsSettingsModalVisible(false);
                    settingsForm.resetFields();
                }}
                okText={t('common.actions.save')}
                cancelText={t('common.actions.cancel')}
                confirmLoading={isSaving}
            >
                {
                    isLoading ? (
                        <Spin size="small" />
                    ) : (
                        <Form
                            form={settingsForm}
                            layout="vertical"
                            requiredMark={false}
                        >
                            <Row gutter={[24, 0]}>
                                <Col xs={24}>
                                    <Form.Item
                                        name="isPublic"
                                        label={t('settings.settings-form.fields.is-public.label')}
                                        rules={[
                                            {
                                                required: true,
                                                message: t('settings.settings-form.fields.is-public.validation'),
                                            }
                                        ]}
                                    >
                                        <Radio.Group buttonStyle="solid">
                                            <Radio.Button value={true}>{ t('settings.settings-form.fields.is-public.public') }</Radio.Button>
                                            <Radio.Button value={false}>{ t('settings.settings-form.fields.is-public.not-public') }</Radio.Button>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    )
                }
            </Modal>
        </div>
    )
};

export default TopBar;