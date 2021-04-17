import { Breadcrumb, Button, Card, Col, Empty, Form, Input, message, Modal, Row, Select, Spin, Tooltip, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { css, SerializedStyles } from '@emotion/core';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import CardImage from '../../components/CardImage';
import { Collection } from '../../types/collection';
import { User } from '../../types/user';

const { confirm } = Modal;
const { Meta } = Card;
const { Option } = Select;
const { TextArea } = Input;

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

    .ant-upload {
        &.ant-upload-select {
            &.ant-upload-select-picture-card {
                width: 100%;
                height: 120px;
            }
        }
    }

    .ant-upload-list-picture-card-container {
        width: 100%;
        height: 130px;
    }

    .ant-upload-list-picture-card {
        .ant-upload-list-item {
            padding: 0;
        }
    }

    .ant-upload-list-picture-card .ant-upload-list-item-thumbnail,
    .ant-upload-list-picture-card .ant-upload-list-item-thumbnail img {
        object-fit: cover;
    }

    .upload-button-text {
        font-size: 12px;

        .heading {
            margin-top: 6px;
        }

        .subheading {
            color: rgba(0, 0, 0, 0.65);
        }
    }
`;

interface Props {
    user?: User;
}

const CollectionList = ({ user }: Props): JSX.Element => {
    const [data, setData] = useState<Array<Collection>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { t } = useTranslation();
    const reference = useRef<HTMLDivElement>(null);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [addForm] = Form.useForm();
    const [fileList, setFileList] = useState<any>([]);
    const [imageData, setImageData] = useState<any>();

    const getCollections = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost:8000/api/collections');
            setData(response.data);
        } catch (error) {
            message.error(t('common.messages.error'));
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
                    message.error(t('common.messages.error'));
                }
            }
        });
    };

    const addCollection = async (values: any) => {
        try {
            setIsSaving(true);
            await axios.post('http://localhost:8000/api/collections', values);
            setIsAddModalVisible(false);
            getCollections();
            message.success(t('collections.list.add-success'));
        } catch (error) {
            message.error(t('common.messages.error'));
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        getCollections();
    }, []);

    const handleFileUpload = async (options: any) => {
        const { onSuccess, onError, file } = options;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post(
                'http://localhost:8000/api/collections/file',
                formData,
                { headers: { 'content-type': 'multipart/form-data' } }
            );
            onSuccess();
            setImageData(response.data);
        } catch (error) {
            onError();
            message.error(t('common.messages.error'));
        };
    };

    const handleOnFileChange = ({ fileList }: any) => {
        setFileList(fileList);
    };

    const handleFileRemove = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/collections/file/${imageData.id}`);
            setFileList([]);
            setImageData(undefined);
        } catch (error) {
            message.error(t('common.messages.error'));
        };
    };

    const handleCollectionAddingCancel = async () => {
        if (!!imageData?.id) {
            handleFileRemove();
        }
        setIsAddModalVisible(false);
        addForm.resetFields();
    };

    return (
        <div ref={reference} css={styles}>
            <Row gutter={[24, 24]}>
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
                            user?.role === 'ADMIN' && (
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setIsAddModalVisible(true);
                                        addForm.resetFields();
                                        setImageData(undefined);
                                        setFileList([]);
                                    }}
                                >
                                    { t('common.actions.add') }
                                </Button>
                            )
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
                                                                cover={<CardImage imageUrl={item.image?.url} />}
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
            <Modal
                title={t('collections.list.add-collection')}
                visible={isAddModalVisible}
                onOk={() => {
                    addForm.validateFields()
                        .then(values => {
                            addCollection({...values, image: imageData });
                        })
                        .catch(error => {});
                }}
                onCancel={handleCollectionAddingCancel}
                okText={t('common.actions.add')}
                cancelText={t('common.actions.cancel')}
                getContainer={reference.current}
                confirmLoading={isSaving}
            >
                <Form
                    form={addForm}
                    layout="vertical"
                    requiredMark={false}
                >
                    <Row gutter={[24, 24]}>
                        <Col span={14}>
                            <Form.Item
                                name="name"
                                label={t('collections.list.add-form.fields.name.label')}
                                rules={[
                                    {
                                        required: true,
                                        message: t('collections.list.add-form.fields.name.validation'),
                                    }
                                ]}
                            >
                                <Input placeholder={t('collections.list.add-form.fields.name.placeholder')} />
                            </Form.Item>
                            <Form.Item
                                name="description"
                                label={t('collections.list.add-form.fields.description.label')}
                                rules={[
                                    {
                                        required: true,
                                        message: t('collections.list.add-form.fields.description.validation'),
                                    }
                                ]}
                            >
                                <TextArea placeholder={t('collections.list.add-form.fields.description.placeholder')} rows={4} />
                            </Form.Item>
                            <Form.Item
                                name="type"
                                label={t('collections.list.add-form.fields.type.label')}
                                rules={[
                                    {
                                        required: true,
                                        message: t('collections.list.add-form.fields.type.validation'),
                                    }
                                ]}
                            >
                                <Select placeholder={t('collections.list.add-form.fields.type.placeholder')}>
                                    <Option value="monety">Monety</Option>
                                    <Option value="fotografie">Fotografie</Option>
                                    <Option value="znaczki">Znaczki</Option>
                                    <Option value="albumy-muzyczne">Albumy muzyczne</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item
                                name="image-upload"
                                label={t('collections.list.add-form.fields.image-upload.label')}
                                valuePropName="fileList"
                                getValueFromEvent={(event: any) => {
                                    if (Array.isArray(event)) {
                                        return event;
                                    }
                                    return event && event.fileList;
                                }}
                            >
                                <Upload
                                    accept="image/png, image/jpeg"
                                    customRequest={handleFileUpload}
                                    onChange={handleOnFileChange}
                                    name="upload"
                                    listType="picture-card"
                                    defaultFileList={fileList}
                                    onRemove={handleFileRemove}
                                    showUploadList={{
                                        showPreviewIcon: false,
                                        showRemoveIcon: true
                                    }}
                                >
                                    {
                                        fileList.length >= 1 ? null : (
                                            <div>
                                                <PlusOutlined />
                                                <div className="upload-button-text">
                                                    <div className="heading">{ t('collections.list.add-form.upload-button.heading') }</div>
                                                    <div className="subheading">
                                                        { t('collections.list.add-form.upload-button.subheading') }:<br/>{ t('collections.list.add-form.upload-button.file-formats') }
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default CollectionList;