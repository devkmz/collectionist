import { Breadcrumb, Button, Card, Col, Empty, message, Modal, Row, Spin, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { css, SerializedStyles } from '@emotion/core';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import CardImage from '../../components/CardImage';
import { Collection } from '../../types/collection';
import { User } from '../../types/user';

const { Meta } = Card;
const { confirm } = Modal;

interface Props {
    user?: User;
}

const styles = (): SerializedStyles => css`
    .ant-card {
        position: relative;

        .ant-card-actions {
            > li {
                margin: 0;
                padding: 0;
            }

            .action-wrapper {
                padding: 12px 0;
            }
        }
    }
`;

const CollectionList = ({ user }: Props): JSX.Element => {
    const [data, setData] = useState<Array<Collection>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    const getCollections = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost:8000/api/collections');
            setData(response.data);
        } catch (error) {
            message.error(`${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteCollection = (id: number, name: string) => {
        confirm({
            title: t('collections.list.delete-collection'),
            icon: <ExclamationCircleOutlined />,
            content:
                <>
                    <div>{ t('collections.list.delete-confirm') }</div>
                    <div>{ name }?</div>
                </>,
            onOk: async () => {
                try {
                    await axios.delete(`http://localhost:8000/api/collections/${id}`);
                    message.success(t('collections.list.delete-success'));
                    getCollections();
                } catch (error) {
                    message.error(t('common.messages.something-went-wrong'));
                }
            }
        });
    };

    useEffect(() => {
        getCollections();
    }, []);

    return (
        <Row gutter={[24, 24]} css={styles}>
            <Col span={5}>
                <Card title={t('collections.list.sections.aside.filtering')}>
                    <p>Lorem ipsum</p>
                </Card>
            </Col>
            <Col span={19}>
                <div className="top-row">
                    <Breadcrumb>
                        <Breadcrumb.Item key="collections">{ t('collections.list.title') }</Breadcrumb.Item>
                    </Breadcrumb>
                    {
                        user?.role === 'ADMIN' && <Button type="primary">{ t('common.actions.add') }</Button>
                    }
                </div>
                {
                    isLoading ? (
                        <div className="load-spinner">
                            <Spin />
                        </div>
                    ) : (
                        <>
                            {
                                data.length > 0 ? (
                                    <Row gutter={[24, 24]}>
                                        {
                                            data.map(item => (
                                                <Col span={6} key={`item-${item.id}`}>
                                                    { console.log(item) }
                                                    <Link to={`/collections/${item.id}`}>
                                                        <Card
                                                            cover={<CardImage imageUrl={item.imageUrl} />}
                                                            actions={user?.role === 'ADMIN' ? [
                                                                <Tooltip title={t('common.actions.view')}>
                                                                    <Link to={`/collections/${item.id}`}>
                                                                        <div className="action-wrapper">
                                                                            <EyeOutlined key="view" />
                                                                        </div>
                                                                    </Link>
                                                                </Tooltip>,
                                                                <Tooltip title={t('common.actions.edit')}>
                                                                    <div
                                                                        className="action-wrapper"
                                                                        onClick={(e) => e.preventDefault()}
                                                                    >
                                                                        <EditOutlined key="edit" />
                                                                    </div>
                                                                </Tooltip>,
                                                                <Tooltip title={t('common.actions.delete')}>
                                                                    <div
                                                                        className="action-wrapper"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            deleteCollection(item.id, item.name);
                                                                        }}
                                                                    >
                                                                        <DeleteOutlined key="delete"  />
                                                                    </div>
                                                                </Tooltip>
                                                            ] : [
                                                                    <Button type="link">{t('common.actions.view')}</Button>
                                                                ]}
                                                        >
                                                            <Meta
                                                                title={item.name}
                                                                description={item.description}
                                                            />
                                                        </Card>
                                                    </Link>
                                                </Col>
                                            ))
                                        }
                                    </Row>
                                ) : (
                                        <Empty />
                                    )
                            }
                        </>
                    )
                }
            </Col>
        </Row>
    );
};

export default CollectionList;