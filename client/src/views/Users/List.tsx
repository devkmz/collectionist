import { Breadcrumb, Col, Form, Input, message, Modal, Row, Select, Space, Spin, Table, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { css, SerializedStyles } from '@emotion/core';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { USER_ROLES } from '../../constants/userRoles';
import { User } from '../../types/user';

const { confirm } = Modal;
const { Link } = Typography;
const { Option } = Select;

const styles = (): SerializedStyles => css`
    .ant-table {
        width: 100%;
    }
    
    .ant-table-container {
        overflow-x: auto;
    }

    .ant-table-fixed-columns .ant-table-cell-fix-right-first:after,
    .ant-table-fixed-columns .ant-table-cell-fix-right-last:after,
    .ant-table-fixed-columns:not(.ant-table-has-fix-right) .ant-table-container:after {
        box-shadow: inset -10px 0 8px -8px rgb(0 0 0 / 15%);
    }

    .ant-table-fixed-columns .ant-table-cell-fix-left-first:after,
    .ant-table-fixed-columns .ant-table-cell-fix-left-last:after,
    .ant-table-fixed-columns:not(.ant-table-has-fix-left) .ant-table-container:before {
        box-shadow: inset 10px 0 8px -8px rgb(0 0 0 / 15%);
    }
`;

const UserList = (): JSX.Element => {
    const [data, setData] = useState<Array<User>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const reference = useRef<HTMLDivElement>(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editForm] = Form.useForm();
    const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
    const { t } = useTranslation();

    const getUsers = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost:8000/api/users');
            setData(response.data);
        } catch (error) {
            message.error(t('common.messages.error'));
        } finally {
            setIsLoading(false);
        }
    };

    const editUser = async (values: any) => {
        try {
            setIsSaving(true);
            await axios.put(`http://localhost:8000/api/users/${selectedUser?.id}`, values);
            setIsEditModalVisible(false);
            getUsers();
            message.success(t('users.list.edit-success'));
            editForm.resetFields();
            setSelectedUser(undefined);
        } catch (error) {
            message.error(t('common.messages.error'));
        } finally {
            setIsSaving(false);
        }
    };

    const deleteUser = (id: number, email: string) => {
        confirm({
            title: t('users.list.delete-user'),
            icon: <ExclamationCircleOutlined />,
            content:
                <>
                    <div>{ t('users.list.delete-confirm') }</div>
                    <div>{ email }</div>
                </>,
            onOk: async () => {
                try {
                    await axios.delete(`http://localhost:8000/api/users/${id}`);
                    message.success(t('users.list.delete-success'));
                    getUsers();
                } catch (error) {
                    message.error(t('common.messages.error'));
                }
            }
        });
    };

    useEffect(() => {
        getUsers();
        // eslint-disable-next-line
    }, []);

    const handleCancel = async () => {
        setIsEditModalVisible(false);
        editForm.resetFields();
        setSelectedUser(undefined);
    };

    const compareAlphabetically = (a: string, b: string) => {
        return a.localeCompare(b);
    }

    const compareDates = (a: moment.Moment, b: moment.Moment) => {
        return a.diff(b);
    }

    const formattedData = useMemo(() => data.map(item => ({
        id: item.id,
        email: item.email,
        firstName: item.firstName,
        lastName: item.lastName,
        createdAt: item.created_at ? moment(item.created_at) : undefined,
        role: item.role
    })), [data]);

    const columns = [
        {
          title: t('users.list.id'),
          dataIndex: 'id',
          key: 'id',
          fixed: true,
          sorter: (a: any, b: any) => a.id - b.id
        },
        {
            title: t('users.list.email'),
            dataIndex: 'email',
            key: 'email',
            sorter: (a: any, b: any) => compareAlphabetically(a.email, b.email)
        },
        {
            title: t('users.list.first-name'),
            dataIndex: 'firstName',
            key: 'firstName',
            sorter: (a: any, b: any) => compareAlphabetically(a.firstName || '', b.firstName || '')
        },
        {
            title: t('users.list.last-name'),
            dataIndex: 'lastName',
            key: 'lastName',
            sorter: (a: any, b: any) => compareAlphabetically(a.lastName || '', b.lastName || '')
        },
        {
            title: t('users.list.created-at'),
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a: any, b: any) => compareDates(a.createdAt, b.createdAt),
            render: (date: moment.Moment) => date.format('DD.MM.YYYY')
        },
        {
            title: t('users.list.role.title'),
            dataIndex: 'role',
            key: 'role',
            sorter: (a: any, b: any) => compareAlphabetically(a.role, b.role),
            render: (role: any) => t(`users.list.role.${role.toLowerCase()}`)
        },
        {
            title: t('users.list.actions'),
            className: 'column-actions',
            fixed: 'right' as 'right',
            render: (row: any) => (
                <Space size="middle">
                    <Link onClick={() => {
                        setSelectedUser(row);
                        editForm.setFieldsValue({
                            firstName: row.firstName,
                            lastName: row.lastName,
                            role: row.role
                        });
                        setIsEditModalVisible(true);
                    }}>
                        { t('common.actions.edit') }
                    </Link>
                    <Link onClick={() => deleteUser(row.id, row.email)}>
                        { t('common.actions.delete') }
                    </Link>
                </Space>
            )
        }
    ];

    return (
        <div css={styles}>
            <div className="top-row">
                <Breadcrumb>
                    <Breadcrumb.Item key="users">{ t('users.list.title') }</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            {
                isLoading ? (
                    <div className="load-spinner">
                        <Spin />
                    </div>
                ) : (
                    <Table className="ant-table-fixed-columns" dataSource={formattedData} columns={columns} />
                )
            }
            <Modal
                title={t('users.list.edit-user')}
                visible={isEditModalVisible}
                onOk={() => {
                    editForm.validateFields()
                    .then(values => {
                        editUser({ ...values, newPassword_confirmation: !!values.newPassword ? values.newPassword_confirmation : undefined });
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
                    form={editForm}
                    layout="vertical"
                    requiredMark={false}
                >
                    <Row gutter={[24, 24]}>
                        <Col xs={24}>
                            <div className="form-label">{ t('users.list.edit-form.fields.email.label') }</div>
                            <div style={{ marginBottom: 24, fontWeight: 500 }}>{ selectedUser?.email }</div>
                        </Col>
                    </Row>
                    <Row gutter={[24, 24]}>
                        <Col xs={24}>
                            <Form.Item
                                name="firstName"
                                label={t('users.list.edit-form.fields.first-name.label')}
                            >
                                <Input placeholder={t('users.list.edit-form.fields.first-name.placeholder')} />
                            </Form.Item>
                            <Form.Item
                                name="lastName"
                                label={t('users.list.edit-form.fields.last-name.label')}
                            >
                                <Input placeholder={t('users.list.edit-form.fields.last-name.placeholder')} />
                            </Form.Item>
                            <Form.Item
                                name="role"
                                label={t('users.list.edit-form.fields.role.label')}
                                rules={[
                                    {
                                        required: true,
                                        message: t('users.list.edit-form.fields.role.validation'),
                                    }
                                ]}
                            >
                                <Select>
                                    {
                                        Object.keys(USER_ROLES).map(role => (
                                            <Option key={role} value={role}>{ t(`users.list.role.${role.toLowerCase()}`) }</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="newPassword"
                                label={t('users.list.edit-form.fields.new-password.label')}
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
                                label={t('users.list.edit-form.fields.confirm-password.label')}
                                dependencies={['newPassword']}
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (getFieldValue('newPassword')) {
                                                if (!value) {
                                                    return Promise.reject(new Error(t('users.list.edit-form.fields.confirm-password.validation.required')));
                                                } else {
                                                    if (getFieldValue('newPassword') !== value) {
                                                        return Promise.reject(new Error(t('users.list.edit-form.fields.confirm-password.validation.mismatch')));
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
        </div>
    );
};

export default UserList;