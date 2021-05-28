import { Breadcrumb, Button, Card, Col, DatePicker, Empty, Form, Input, InputNumber, Menu, message, Modal, Row, Spin, Tooltip, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, ExclamationCircleOutlined, FileExcelOutlined, FilePdfOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import { css, SerializedStyles } from '@emotion/core';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useIsMounted from 'react-is-mounted-hook';
import { Link, useParams } from 'react-router-dom';

import CardImage from '../../components/CardImage';
import ReportLink from '../../components/ReportLink';
import { Attribute } from '../../types/attribute';
import { Collection } from '../../types/collection';
import { CollectionElement } from '../../types/collectionElement';
import { User } from '../../types/user';

const { confirm } = Modal;
const { Meta } = Card;
const { TextArea } = Input;

const styles = (): SerializedStyles => css`
    .actions {
        @media (max-width: 991px) {
            display: none;
        }

        &.actions-mobile {
            display: none;
            margin-bottom: 32px;

            @media (max-width: 991px) {
                display: block;
            }
        }

        .ant-card {
            &:not(:last-of-type) {
                margin-bottom: 24px;
            }
        }

        .ant-menu {
            border-right: none;
        }
    }

    .add-element-form {
        .ant-input,
        .ant-input-number,
        .ant-picker,
        .ant-picker-input {
            width: 100%;
        }
    }

    .attributes-label {
        padding-bottom: 8px;
    }

    .attribute {
        margin-bottom: 6px;
    }
`;

interface Props {
    user?: User;
}

interface Params {
    id?: string;
}

const { REACT_APP_API_URL } = process.env;

const CollectionSingle = ({ user }: Props): JSX.Element => {
    const [collection, setCollection] = useState<Collection | undefined>(undefined);
    const [collectionTypeAttributes, setCollectionTypeAttributes] = useState<Array<Attribute>>([]);
    const [data, setData] = useState<Array<CollectionElement>>([]);
    const [filteredData, setFilteredData] = useState<Array<CollectionElement>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { t } = useTranslation();
    const reference = useRef<HTMLDivElement>(null);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [addForm] = Form.useForm();
    const [fileList, setFileList] = useState<any>([]);
    const [imageData, setImageData] = useState<any>(undefined);
    const [selectedCollectionElement, setSelectedCollectionElement] = useState<CollectionElement>();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const isMounted = useIsMounted();

    const { id }: Params = useParams();

    const getCollection = async () => {
        try {
            if (!isMounted()) {
                return;
            }

            setIsLoading(true);
            const response = await axios.get(`${REACT_APP_API_URL}/collections/${id}`);
            setCollection(response.data);
            const attributes = await axios.get(`${REACT_APP_API_URL}/types/${response.data.collection_type_id}/attributes`);
            setCollectionTypeAttributes(attributes.data);
        } catch (error) {
            if (error.response.status !== 403) {
                message.error(t('common.messages.error'));
            }
        } finally {
            if (isMounted()) {
                setIsLoading(false);
            }
        }
    };

    const getCollectionElements = async () => {
        try {
            if (!isMounted()) {
                return;
            }

            setIsLoading(true);
            const response = await axios.get(`${REACT_APP_API_URL}/collections/${id}/elements`);
            setData(response.data);
        } catch (error) {
            if (error.response.status !== 403) {
                message.error(t('common.messages.error'));
            }
        } finally {
            if (isMounted()) {
                setIsLoading(false);
            }
        }
    };

    const deleteCollectionElement = (elementId: number, name: string) => {
        confirm({
            title: t('collections.single.delete-collection-element'),
            icon: <ExclamationCircleOutlined />,
            content:
                <>
                    <div>{ t('collections.single.delete-confirm') }</div>
                    <div>{ name }?</div>
                </>,
            onOk: async () => {
                try {
                    await axios.delete(`${REACT_APP_API_URL}/collections/elements/${elementId}`);
                    message.success(t('collections.single.delete-success'));
                    getCollectionElements();
                } catch (error) {
                    message.error(t('common.messages.error'));
                }
            }
        });
    };

    const addCollectionElement = async (values: any) => {
        try {
            setIsSaving(true);
            await axios.post(`${REACT_APP_API_URL}/collections/${id}/elements`, values);
            setIsAddModalVisible(false);
            getCollectionElements();
            message.success(t('collections.single.add-success'));
        } catch (error) {
            message.error(t('common.messages.error'));
        } finally {
            setIsSaving(false);
        }
    };

    const editCollectionElement = async (values: any) => {
        try {
            setIsSaving(true);
            await axios.put(`${REACT_APP_API_URL}/collections/elements/${selectedCollectionElement?.id}`, values);
            setIsAddModalVisible(false);
            getCollectionElements();
            message.success(t('collections.single.edit-success'));
            setSelectedCollectionElement(undefined);
        } catch (error) {
            message.error(t('common.messages.error'));
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        getCollection();
        getCollectionElements();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (isMounted()) {
            setFilteredData(data);
        }
    }, [data, isMounted]);

    const handleFileUpload = async (options: any) => {
        const { onSuccess, onError, file } = options;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post(
                `${REACT_APP_API_URL}/collections/file`,
                formData,
                { headers: { 'content-type': 'multipart/form-data' } }
            );
            onSuccess();
            setImageData(response.data);
        } catch (error) {
            onError();
            message.error(t('common.messages.error'));
        }
    };

    const handleOnFileChange = ({ fileList }: any) => {
        setFileList(fileList);
    };

    const handleFileRemove = async () => {
        try {
            await axios.delete(`${REACT_APP_API_URL}/collections/file/${imageData.id}`);
            setFileList([]);
            setImageData(undefined);
        } catch (error) {
            message.error(t('common.messages.error'));
        }
    };

    const handleCollectionElementAddingCancel = async () => {
        if (!!imageData?.id) {
            handleFileRemove();
        }
        setIsAddModalVisible(false);
        addForm.resetFields();
    };

    const handleCollectionElementEditingCancel = () => {
        setIsAddModalVisible(false);
        addForm.resetFields();
        setSelectedCollectionElement(undefined);
        setFileList([]);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setFilteredData([...data].filter(item => handleFilter(query, item)));
    };

    const handleFilter = (query: string, item: CollectionElement) => {
        return item.elementName.toLowerCase().includes(query.toLowerCase()) || item.elementDescription.toLowerCase().includes(query.toLowerCase());
    };

    return (
        <div ref={reference} css={styles}>
            <Row gutter={[24, 24]}>
                <Col className="actions" xs={24} sm={24} md={7} lg={6} xxl={5}>
                    <Card title={t('collections.single.sections.aside.report.heading')}>
                        <Menu
                            mode="inline"
                            inlineIndent={0}
                        >
                            <Menu.Item icon={<FilePdfOutlined />}>
                                <ReportLink url={`${REACT_APP_API_URL}/collections/${id}/pdf`} filename={`collection-${id}-report.pdf`}>
                                    { t('collections.single.sections.aside.report.actions-menu.download-report.pdf') }
                                </ReportLink>
                            </Menu.Item>
                            <Menu.Item icon={<FileExcelOutlined />}>
                                <ReportLink url={`${REACT_APP_API_URL}/collections/${id}/xlsx`} filename={`collection-${id}-report.xlsx`}>
                                    { t('collections.single.sections.aside.report.actions-menu.download-report.xlsx') }
                                </ReportLink>
                            </Menu.Item>
                        </Menu>
                    </Card>
                    <Card title={t('collections.single.sections.aside.filtering.heading')}>
                        <Input
                            placeholder={t('collections.single.sections.aside.filtering.search-placeholder')}
                            allowClear
                            onChange={(e) => handleSearch(e.target.value)}
                            suffix={<SearchOutlined />}
                            value={searchQuery}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={17} lg={18} xxl={19}>
                    <div className="top-row">
                        <Breadcrumb>
                            <Breadcrumb.Item key="collections"><Link to="/collections">{ t('collections.list.title') }</Link></Breadcrumb.Item>
                            <Breadcrumb.Item key="collection">{ collection?.name || '-' }</Breadcrumb.Item>
                        </Breadcrumb>
                        {
                            user?.role === 'ADMIN' && (
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setIsAddModalVisible(true);
                                        addForm.resetFields();
                                        addForm.setFieldsValue({
                                            elements_attributes: collectionTypeAttributes
                                        })
                                    }}
                                >
                                    { t('common.actions.add') }
                                </Button>
                            )
                        }
                    </div>
                    <div className="actions actions-mobile">
                        <Card title={t('collections.single.sections.aside.report.heading')}>
                            <Menu
                                mode="inline"
                                inlineIndent={0}
                            >
                                <Menu.Item icon={<FilePdfOutlined />}>
                                    <ReportLink url={`${REACT_APP_API_URL}/collections/${id}/pdf`} filename={`collection-${id}-report.pdf`}>
                                        { t('collections.single.sections.aside.report.actions-menu.download-report.pdf') }
                                    </ReportLink>
                                </Menu.Item>
                                <Menu.Item icon={<FileExcelOutlined />}>
                                    <ReportLink url={`${REACT_APP_API_URL}/collections/${id}/xlsx`} filename={`collection-${id}-report.xlsx`}>
                                        { t('collections.single.sections.aside.report.actions-menu.download-report.xlsx') }
                                    </ReportLink>
                                </Menu.Item>
                            </Menu>
                        </Card>
                        <Card title={t('collections.single.sections.aside.filtering.heading')}>
                            <Input
                                placeholder={t('collections.single.sections.aside.filtering.search-placeholder')}
                                allowClear
                                onChange={(e) => handleSearch(e.target.value)}
                                suffix={<SearchOutlined />}
                                value={searchQuery}
                            />
                        </Card>
                    </div>
                    {
                        isLoading ? (
                            <div className="load-spinner">
                                <Spin />
                            </div>
                        ) : (
                            <>
                                {
                                    filteredData.length > 0 ? (
                                        <Row gutter={[24, 24]}>
                                            {
                                                filteredData.map(item => (
                                                    <Col className="collection-card" xs={12} sm={12} md={8} xl={6} xxl={6} key={`item-${item.id}`}>
                                                        <Link to={`/collections/${id}/elements/${item.id}`}>
                                                            <Card
                                                                cover={<CardImage imageUrl={item.elementImage?.url} />}
                                                                actions={user?.role === 'ADMIN' ? [
                                                                    <Tooltip key="view" title={t('common.actions.view')}>
                                                                        <Link to={`/collections/${id}/elements/${item.id}`}>
                                                                            <div className="action-wrapper">
                                                                                <EyeOutlined key="view" />
                                                                            </div>
                                                                        </Link>
                                                                    </Tooltip>,
                                                                    <Tooltip key="edit" title={t('common.actions.edit')}>
                                                                        <div
                                                                            className="action-wrapper"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                setSelectedCollectionElement(item);
                                                                                addForm.setFieldsValue({
                                                                                    elementName: item.elementName,
                                                                                    elementDescription: item.elementDescription,
                                                                                    elementImage: !!item.elementImage?.id ? [
                                                                                        {
                                                                                            name: item.elementImage?.name,
                                                                                            status: 'done',
                                                                                            url: item.elementImage?.url
                                                                                        }
                                                                                    ] : undefined,
                                                                                    elements_attributes: item.elements_attributes?.map(attr => {
                                                                                        if (collectionTypeAttributes.find(a => a.id === attr.attribute_id)?.attributeType === 'DATE') {
                                                                                            return { ...attr, value: moment(attr.value) };
                                                                                        }
                                                                                        return attr;
                                                                                    })
                                                                                });
                                                                                setFileList(!!item.elementImage?.id ? [
                                                                                    {
                                                                                        name: item.elementImage?.name,
                                                                                        status: 'done',
                                                                                        url: item.elementImage?.url
                                                                                    }
                                                                                ] : []);
                                                                                setImageData(item.elementImage);
                                                                                setIsAddModalVisible(true);
                                                                            }}
                                                                        >
                                                                            <EditOutlined key="edit" />
                                                                        </div>
                                                                    </Tooltip>,
                                                                    <Tooltip key="delete" title={t('common.actions.delete')}>
                                                                        <div
                                                                            className="action-wrapper"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                deleteCollectionElement(item.id, item.elementName);
                                                                            }}
                                                                        >
                                                                            <DeleteOutlined key="delete"  />
                                                                        </div>
                                                                    </Tooltip>
                                                                ] : [
                                                                        <Button key="view" type="link">{ t('common.actions.view') }</Button>
                                                                    ]}
                                                            >
                                                                <Meta
                                                                    title={item.elementName}
                                                                    description={item.elementDescription}
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
                title={!!selectedCollectionElement?.id ? t('collections.single.edit-collection-element') : t('collections.single.add-collection-element')}
                visible={isAddModalVisible}
                onOk={() => {
                    if (!selectedCollectionElement) {
                        addForm.validateFields()
                        .then(values => {
                            addCollectionElement({...values, collection_id: id, elementImage: imageData });
                        })
                        .catch(error => {});
                    } else {
                        addForm.validateFields()
                        .then(values => {
                            editCollectionElement({...values, id: selectedCollectionElement.id, collection_id: id, elementImage: (!!imageData?.id ? imageData : 0)});
                        })
                        .catch(error => {});
                    }
                }}
                onCancel={!!selectedCollectionElement?.id ? handleCollectionElementEditingCancel : handleCollectionElementAddingCancel}
                okText={!!selectedCollectionElement?.id ? t('common.actions.save') : t('common.actions.add')}
                cancelText={t('common.actions.cancel')}
                getContainer={reference.current}
                confirmLoading={isSaving}
            >
                <Form
                    form={addForm}
                    className="add-element-form"
                    layout="vertical"
                    requiredMark={false}
                >
                    <Row gutter={[24, 24]}>
                        <Col xs={24} sm={14}>
                            <Form.Item
                                name="elementName"
                                label={t('collections.single.add-form.fields.name.label')}
                                rules={[
                                    {
                                        required: true,
                                        message: t('collections.single.add-form.fields.name.validation'),
                                    }
                                ]}
                            >
                                <Input placeholder={t('collections.single.add-form.fields.name.placeholder')} />
                            </Form.Item>
                            <Form.Item
                                name="elementDescription"
                                label={t('collections.single.add-form.fields.description.label')}
                                rules={[
                                    {
                                        required: true,
                                        message: t('collections.single.add-form.fields.description.validation'),
                                    }
                                ]}
                            >
                                <TextArea placeholder={t('collections.single.add-form.fields.description.placeholder')} rows={4} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={10}>
                            <Form.Item
                                className="upload"
                                name="elementImage"
                                label={t('collections.single.add-form.fields.image-upload.label')}
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
                                                    <div className="heading">{ t('collections.single.add-form.upload-button.heading') }</div>
                                                    <div className="subheading">
                                                        { t('collections.single.add-form.upload-button.subheading') }:<br/>{ t('collections.single.add-form.upload-button.file-formats') }
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                    {
                        collectionTypeAttributes.length > 0 && (
                            <Row gutter={[24, 24]}>
                                <Col xs={24}>
                                    <div className="attributes-label">{ t('collectionTypes.list.add-form.fields.attributes.label') }</div>
                                    <Form.List name="elements_attributes">
                                        {fields => (
                                            <Row gutter={[24, 0]}>
                                                {
                                                    fields.map(({ key, name, fieldKey, ...restField }) => (
                                                        <Col xs={12} key={key} className="attribute">
                                                            {  
                                                                !!collectionTypeAttributes && collectionTypeAttributes[key]?.attributeType === 'TEXT' && (
                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={[name, 'value']}
                                                                        fieldKey={[fieldKey, 'value']}
                                                                        label={collectionTypeAttributes && collectionTypeAttributes[key].attributeName}
                                                                        rules={[
                                                                            {
                                                                                required: true,
                                                                                message: t('collections.single.add-form.fields.attributes.validation.input')
                                                                            }
                                                                        ]}
                                                                    >
                                                                        <Input placeholder={t('collections.single.add-form.fields.attributes.placeholder.input')} />
                                                                    </Form.Item>
                                                                )
                                                            }
                                                            {
                                                                !!collectionTypeAttributes && collectionTypeAttributes[key]?.attributeType === 'NUMBER' && (
                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={[name, 'value']}
                                                                        fieldKey={[fieldKey, 'value']}
                                                                        label={collectionTypeAttributes && collectionTypeAttributes[key].attributeName}
                                                                        rules={[
                                                                            {
                                                                                required: true,
                                                                                message: t('collections.single.add-form.fields.attributes.validation.input')
                                                                            }
                                                                        ]}
                                                                    >
                                                                        <InputNumber placeholder={t('collections.single.add-form.fields.attributes.placeholder.input')} />
                                                                    </Form.Item>
                                                                )
                                                            }
                                                            {
                                                                !!collectionTypeAttributes && collectionTypeAttributes[key]?.attributeType === 'DATE' && (
                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={[name, 'value']}
                                                                        fieldKey={[fieldKey, 'value']}
                                                                        label={collectionTypeAttributes && collectionTypeAttributes[key].attributeName}
                                                                        rules={[
                                                                            {
                                                                                required: true,
                                                                                message: t('collections.single.add-form.fields.attributes.validation.datepicker')
                                                                            }
                                                                        ]}
                                                                    >
                                                                        <DatePicker placeholder={t('collections.single.add-form.fields.attributes.placeholder.datepicker')} />
                                                                    </Form.Item>
                                                                )
                                                            }
                                                            {
                                                                !!collectionTypeAttributes && collectionTypeAttributes[key]?.attributeType === 'LOCATION' && (
                                                                    <Form.Item
                                                                        {...restField}
                                                                        name={[name, 'value']}
                                                                        fieldKey={[fieldKey, 'value']}
                                                                        label={collectionTypeAttributes && collectionTypeAttributes[key].attributeName}
                                                                        rules={[
                                                                            {
                                                                                required: true,
                                                                                message: t('collections.single.add-form.fields.attributes.validation.location')
                                                                            }
                                                                        ]}
                                                                    >
                                                                        <Input placeholder={t('collections.single.add-form.fields.attributes.placeholder.location')} />
                                                                    </Form.Item>
                                                                )
                                                            }
                                                        </Col>
                                                    ))
                                                }
                                            </Row>
                                        )}
                                    </Form.List>
                                </Col>
                            </Row>
                        )
                    }
                </Form>
            </Modal>
        </div>
    );
};

export default CollectionSingle;