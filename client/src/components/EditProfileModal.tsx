import { Col, Form, Input, message, Modal, Row } from 'antd';
import axios from 'axios';
import React, { RefObject, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { updateUser, useUserDispatch, useUserState } from '../context';

interface Props {
    reference: RefObject<HTMLDivElement>;
    visible: boolean;
    onClose: () => void;
}

const { REACT_APP_API_URL } = process.env;

const EditProfileModal = ({ reference, visible, onClose = () => {} }: Props): JSX.Element => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [isSaving, setIsSaving] = useState(false);
    const { user } = useUserState();
    const dispatch = useUserDispatch();

    const editUserProfile = async (values: any) => {
        try {
            setIsSaving(true);
            const token = sessionStorage.getItem('collectionist-token');

            if (!token) {
                throw new Error();
            }

            await axios({
                method: 'put',
                url: `${REACT_APP_API_URL}/user`,
                headers: {
                    'Authorization': token
                },
                data: values
            });

            updateUser(dispatch);
            message.success(t('users.profile.edit-success'))
            onClose();
            form.resetFields();
        } catch (error) {
            if (error?.response?.data?.error && error?.response?.data?.error === 'invalid_password') {
                form.setFields([
                    {
                        name: 'password',
                        errors: [
                            t('users.profile.edit-form.fields.current-password.invalid-password')
                        ]
                    }
                ]);
            } else {
                message.error(t('common.messages.error'));
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        onClose();
        form.resetFields();
    };

    useEffect(() => {
        if (visible) {
            form.setFieldsValue({
                firstName: user?.firstName,
                lastName: user?.lastName
            });
        }
        // eslint-disable-next-line
    }, [visible]);

    return (
        <Modal
            destroyOnClose
            title={t('users.profile.edit')}
            visible={visible}
            onOk={async () => {
                form.validateFields()
                .then(values => {
                    editUserProfile({ ...values, newPassword_confirmation: !!values.newPassword ? values.newPassword_confirmation : undefined });
                })
                .catch(error => {});
            }}
            onCancel={handleCancel}
            okText={t('common.actions.save')}
            cancelText={t('common.actions.cancel')}
            getContainer={reference.current}
            confirmLoading={isSaving}
        >
            <Form
                form={form}
                layout="vertical"
                requiredMark={false}
            >
                <Row gutter={[24, 24]}>
                    <Col xs={24}>
                        <Form.Item
                            name="firstName"
                            label={t('users.profile.edit-form.fields.first-name.label')}
                        >
                            <Input placeholder={t('users.profile.edit-form.fields.first-name.placeholder')} />
                        </Form.Item>
                        <Form.Item
                            name="lastName"
                            label={t('users.profile.edit-form.fields.last-name.label')}
                        >
                            <Input placeholder={t('users.profile.edit-form.fields.last-name.placeholder')} />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label={t('users.profile.edit-form.fields.current-password.label')}
                            rules={[
                                {
                                    required: true,
                                    message: t('users.profile.edit-form.fields.current-password.validation'),
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="newPassword"
                            label={t('users.profile.edit-form.fields.new-password.label')}
                            rules={[
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
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="newPassword_confirmation"
                            label={t('users.profile.edit-form.fields.confirm-password.label')}
                            dependencies={['newPassword']}
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (getFieldValue('newPassword')) {
                                            if (!value) {
                                                return Promise.reject(new Error(t('users.profile.edit-form.fields.confirm-password.validation.required')));
                                            } else {
                                                if (getFieldValue('newPassword') !== value) {
                                                    return Promise.reject(new Error(t('users.profile.edit-form.fields.confirm-password.validation.mismatch')));
                                                }
                                            }
                                        }
                                        
                                        return Promise.resolve();
                                    },
                                })
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
};

export default EditProfileModal;