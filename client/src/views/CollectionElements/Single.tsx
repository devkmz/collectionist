import { Breadcrumb, Card, Col, Descriptions, Menu, message, Row, Spin } from 'antd';
import { ArrowLeftOutlined, FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';
import axios from 'axios';
import { css, SerializedStyles } from '@emotion/core';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useIsMounted from 'react-is-mounted-hook';
import { Link, useParams } from 'react-router-dom';

import CardImage from '../../components/CardImage';
import Map from '../../components/Map';
import ReportLink from '../../components/ReportLink';
import { Collection } from '../../types/collection';
import { CollectionElement } from '../../types/collectionElement';
import { useWindowWidth } from '../../utils/hooks';

const styles = (): SerializedStyles => css`
    .image {
        .no-image {
            background: rgba(255, 255, 255, 0.7);
        }
    }

    .actions {
        .ant-card {
            @media (min-width: 992px) and (max-width: 1199px) {
                display: flex;
                justify-content: space-between;

                .ant-card-head {
                    min-height: unset;
                    padding-top: 16px;
                    padding-bottom: 16px;

                    .ant-card-head-title {
                        padding: 0;
                        height: 40px;
                        line-height: 40px;
                    }
                }

                .ant-card-body {
                    padding-top: 16px;
                    padding-bottom: 16px;
                }
            }
        }

        .ant-menu {
            border-right: none;
            
            @media (min-width: 768px) and (max-width: 1199px) {
                .ant-menu-item {
                    display: inline-block;
                    width: unset;
                    margin-bottom: 0;
                    margin-top: 0;
                    margin-right: 24px;
                }
            }
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
        min-width: 250px;
        width: 100%;
        height: 300px;
    }
`;

interface Params {
    id?: string;
    elementId?: string;
}

const { REACT_APP_API_URL } = process.env;

const CollectionElementSingle = (): JSX.Element => {
    const [collection, setCollection] = useState<Collection | undefined>(undefined);
    const [data, setData] = useState<CollectionElement | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const windowWidth = useWindowWidth();
    const { t } = useTranslation();
    const isMounted = useIsMounted();

    const { id, elementId }: Params = useParams();

    const getCollection = async () => {
        try {
            if (!isMounted()) {
                return;
            }

            setIsLoading(true);
            const response = await axios.get(`${REACT_APP_API_URL}/collections/${id}`);
            setCollection(response.data);
        } catch (error) {
            if (error?.response?.status !== 403) {
                message.error(t('common.messages.error'));
            }
        } finally {
            if (isMounted()) {
                setIsLoading(false);
            }
        }
    };

    const getElement = async () => {
        try {
            if (!isMounted()) {
                return;
            }

            setIsLoading(true);
            const response = await axios.get(`${REACT_APP_API_URL}/collections/elements/${elementId}`);
            setData(response.data);
        } catch (error) {
            if (error?.response?.status !== 403) {
                message.error(t('common.messages.error'));
            }
        } finally {
            if (isMounted()) {
                setIsLoading(false);
            }
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
                            <Col className="image" xs={24} sm={24} md={10} lg={10} xl={9}>
                                <CardImage hasPreview imageUrl={data?.elementImage?.url} />
                            </Col>
                            <Col className="data" xs={24} sm={24} md={14} lg={14} xl={9}>
                                <div>
                                    <h2>{ data?.elementName }</h2>
                                    <p>{ data?.elementDescription }</p>
                                </div>
                            </Col>
                            <Col className="actions" xs={24} xl={6}>
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
                                            <ReportLink url={`${REACT_APP_API_URL}/collections/elements/${elementId}/pdf`} filename={`collection-element-${elementId}-report.pdf`}>
                                                { t('collectionElements.single.actions-menu.download-report.pdf') }
                                            </ReportLink>
                                        </Menu.Item>
                                        <Menu.Item icon={<FileExcelOutlined />}>
                                            <ReportLink url={`${REACT_APP_API_URL}/collections/elements/${elementId}/xlsx`} filename={`collection-element-${elementId}-report.xlsx`}>
                                            { t('collectionElements.single.actions-menu.download-report.xlsx') }
                                            </ReportLink>
                                        </Menu.Item>
                                    </Menu>
                                </Card>
                            </Col>
                        </Row>
                        {
                            data?.elements_attributes && data?.elements_attributes.length > 0 && (
                                <Row className="details" gutter={[24, 24]}>
                                    <Col xs={24}>
                                        <h2>{ t('collectionElements.single.details') }</h2>
                                        <Descriptions
                                            bordered
                                            column={1}
                                            layout={windowWidth && windowWidth < 768 ? "vertical" : "horizontal"}
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
                            )
                        }
                    </>
                )
            }
        </div>
    );
};

export default CollectionElementSingle;