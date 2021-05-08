import { Breadcrumb, Card, Col, Descriptions, Menu, message, Row, Spin } from 'antd';
import { ArrowLeftOutlined, FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';
import axios from 'axios';
import { css, SerializedStyles } from '@emotion/core';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import Map from '../../components/Map';
import { Collection } from '../../types/collection';
import { CollectionElement } from '../../types/collectionElement';

const styles = (): SerializedStyles => css`
    .image {
        img {
            max-width: 100%;
        }
    }

    .details {
        margin-top: 24px;

        .ant-descriptions {
            background: #fff;

            .ant-descriptions-item-label {
                background: #fafafa;
                font-weight: 500;
            }
        }
    }

    .leaflet-container {
        min-width: 300px;
        width: 100%;
        height: 300px;
    }
`;

interface Params {
    id?: string;
    elementId?: string;
}

const CollectionElementSingle = (): JSX.Element => {
    const [collection, setCollection] = useState<Collection | undefined>(undefined);
    const [data, setData] = useState<CollectionElement | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    const { id, elementId }: Params = useParams();

    const getCollection = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:8000/api/collections/${id}`);
            setCollection(response.data);
        } catch (error) {
            message.error(t('common.messages.error'));
        } finally {
            setIsLoading(false);
        }
    };

    const getElement = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:8000/api/collections/elements/${elementId}`);
            console.log(response.data);
            setData(response.data);
        } catch (error) {
            message.error(t('common.messages.error'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCollection();
        getElement();
        // eslint-disable-next-line
    }, []);

    return (
        <div css={styles}>
            <div className="top-row">
                <Breadcrumb>
                    <Breadcrumb.Item key="collections"><Link to="/collections">{ t('collections.list.title') }</Link></Breadcrumb.Item>
                    <Breadcrumb.Item key="collection"><Link to={`/collections/${id}`}>{ collection?.name || '-' }</Link></Breadcrumb.Item>
                    <Breadcrumb.Item key="collection-element">{ data?.elementName || '-' }</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            {
                isLoading ? (
                    <div className="load-spinner">
                        <Spin />
                    </div>
                ) : (
                    <>
                        <Row gutter={[24, 24]}>
                            <Col className="image" xs={9}>
                                <img src={data?.elementImage?.url} alt={data?.elementImage?.name} />
                            </Col>
                            <Col className="data" xs={9}>
                                <h2>{ data?.elementName }</h2>
                                <p>{ data?.elementDescription }</p>
                            </Col>
                            <Col className="actions" xs={6}>
                                <Card title="Czynności">
                                    <Menu
                                        mode="inline"
                                        inlineIndent={0}
                                    >
                                        <Menu.Item icon={<ArrowLeftOutlined />}>
                                            <Link to={`/collections/${id}`}>
                                                { t('collectionElements.single.actions-menu.return-to-collection') }
                                            </Link>
                                        </Menu.Item>
                                        <Menu.Item icon={<FilePdfOutlined />}>
                                            <Link to={`/collections/${id}`}>
                                                { t('collectionElements.single.actions-menu.download-report.pdf')}
                                            </Link>
                                        </Menu.Item>
                                        <Menu.Item icon={<FileExcelOutlined />}>
                                            <Link to={`/collections/${id}`}>
                                                { t('collectionElements.single.actions-menu.download-report.xlsx') }
                                            </Link>
                                        </Menu.Item>
                                    </Menu>
                                </Card>
                            </Col>
                        </Row>
                        <Row className="details" gutter={[24, 24]}>
                            <Col xs={24}>
                                <h2>{ t('collectionElements.single.details') }</h2>
                                <Descriptions
                                    bordered
                                    column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                                >
                                    {
                                        data?.elements_attributes?.map(attr => (
                                            <Descriptions.Item
                                                key={`attr-${attr.attribute_id}`}
                                                label={attr.attributeName}
                                            >
                                                {
                                                    !!attr.attributeType && attr.attributeType === 'DATE' && (
                                                        <span>{ moment(attr.value).format('DD.MM.YYYY') }</span>
                                                    )
                                                }
                                                {
                                                    !!attr.attributeType && attr.attributeType === 'LOCATION' && (
                                                        <Map location={attr.value as string} />
                                                    )
                                                }
                                                {
                                                    !!attr.attributeType && attr.attributeType !== 'DATE' && attr.attributeType !== 'LOCATION' && (
                                                        <span>{ attr.value }</span>
                                                    )
                                                }
                                            </Descriptions.Item>
                                        ))
                                    }
                                </Descriptions>
                            </Col>
                        </Row>
                    </>
                )
            }
        </div>
    );
};

export default CollectionElementSingle;