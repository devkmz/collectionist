import { Breadcrumb, Button, Card, Col, Empty, message, Row, Spin, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import { css, SerializedStyles } from '@emotion/core';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import CardImage from '../../components/CardImage';
import { Collection } from '../../types/collection';
import { User } from '../../types/user';

const { Meta } = Card;

interface Props {
    user?: User;
}

const styles = (): SerializedStyles => css`
    .ant-card {
        position: relative;
    }
`;

const CollectionList = ({ user }: Props): JSX.Element => {
    const [data, setData] = useState<Array<Collection>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
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
                                                    <Link to={`/collections/${item.id}`}>
                                                        <Card
                                                            cover={<CardImage imageUrl={item.imageUrl} />}
                                                            actions={user?.role === 'ADMIN' ? [
                                                                <Tooltip title={t('common.actions.view')}>
                                                                    <EyeOutlined key="view" onClick={(e) => e.preventDefault() } />
                                                                </Tooltip>,
                                                                <Tooltip title={t('common.actions.edit')}>
                                                                    <EditOutlined key="edit" onClick={(e) => e.preventDefault() } />
                                                                </Tooltip>,
                                                                <Tooltip title={t('common.actions.delete')}>
                                                                    <DeleteOutlined key="delete" onClick={(e) => e.preventDefault() } />
                                                                </Tooltip>
                                                            ] : [
                                                                <Button type="link">{ t('common.actions.view') }</Button>
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