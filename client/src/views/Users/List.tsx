import { Breadcrumb, message, Space, Spin, Table, Typography } from 'antd';
import axios from 'axios';
import { css, SerializedStyles } from '@emotion/core';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { User } from '../../types/user';

const { Link } = Typography;

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

    useEffect(() => {
        getUsers();
        // eslint-disable-next-line
    }, []);

    const compareAlphabetically = (a: string, b: string) => {
        return a.localeCompare(b);
    }

    const compareDates = (a: moment.Moment, b: moment.Moment) => {
        return moment(a).diff(moment(b));
    }

    const formattedData = useMemo(() => data.map(item => ({
        id: item.id,
        email: item.email,
        firstName: item.firstName || '-',
        lastName: item.lastName || '-',
        createdAt: item.created_at ? moment(item.created_at).format('DD.MM.YYYY') : '-',
        role: t(`users.list.role.${item.role.toLowerCase()}`)
    })), [data, t]);

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
            sorter: (a: any, b: any) => compareAlphabetically(a.firstName, b.firstName)
        },
        {
            title: t('users.list.last-name'),
            dataIndex: 'lastName',
            key: 'lastName',
            sorter: (a: any, b: any) => compareAlphabetically(a.lastName, b.lastName)
        },
        {
            title: t('users.list.created-at'),
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a: any, b: any) => compareDates(moment(a.createdAt), moment(b.createdAt))
        },
        {
            title: t('users.list.role.title'),
            dataIndex: 'role',
            key: 'role',
            sorter: (a: any, b: any) => compareAlphabetically(a.role, b.role)
        },
        {
            title: t('users.list.actions'),
            className: 'column-actions',
            fixed: 'right' as 'right',
            render: (row: any) => (
                <Space size="middle">
                    <Link>
                        { t('common.actions.edit') }
                    </Link>
                    <Link>
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
        </div>
    );
};

export default UserList;