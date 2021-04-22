import { Breadcrumb, Button, Col, Form, Input, message, Modal, Row, Select, Space, Spin, Table, Typography } from 'antd';
import { ExclamationCircleOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { css, SerializedStyles } from '@emotion/core';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ATTRIBUTE_DATA_TYPES } from '../../constants/attributeDataTypes';
import { CollectionType } from '../../types/collectionType';

const { confirm } = Modal;
const { Link } = Typography;
const { Option } = Select;

const styles = (): SerializedStyles => css`
    .ant-table {
        .column-name {
            word-break: break-word;
        }

        .column-actions {
            text-align: right;
        }
    }

    .ant-form {
        .field-wrapper {
            display: flex;
            flex-wrap: wrap;         
        }

        .ant-space {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 8px;

            @media (max-width: 575px) {
                margin-bottom: 16px;
            }

            .ant-space-item {
                margin-right: 0 !important;

                &:first-child {
                    flex: 0 1 calc(100% - 30px);

                    .ant-form-item {
                        width: 50%;
                        flex-basis: 50%;
                        padding-right: 8px;

                        .ant-input,
                        .ant-select {
                            width: 100%;
                        }

                        @media (max-width: 575px) {
                            width: 100%;
                            flex-basis: 100%;
                        }
                    }
                }

                &:last-child {
                    flex: 0 0 30px;
                    text-align: center;
                }
            }
        }
    }

    .attributes-label {
        padding-bottom: 8px;
    }
`;

const CollectionTypeList = (): JSX.Element => {
    const [data, setData] = useState<Array<CollectionType>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { t } = useTranslation();
    const reference = useRef<HTMLDivElement>(null);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [addForm] = Form.useForm();
    const [selectedType, setSelectedType] = useState<CollectionType | undefined>(undefined);

    const getCollectionTypes = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost:8000/api/types');
            setData(response.data);
        } catch (error) {
            message.error(t('common.messages.error'));
        } finally {
            setIsLoading(false);
        }
    };

    const deleteCollectionType = (id: number, name: string) => {
        confirm({
            title: t('collectionTypes.list.delete-collection-type'),
            icon: <ExclamationCircleOutlined />,
            content:
                <>
                    <div>{ t('collectionTypes.list.delete-confirm') }</div>
                    <div>{ name }?</div>
                </>,
            onOk: async () => {
                try {
                    await axios.delete(`http://localhost:8000/api/types/${id}`);
                    message.success(t('collectionTypes.list.delete-success'));
                    getCollectionTypes();
                } catch (error) {
                    message.error(t('common.messages.error'));
                }
            }
        });
    };

    const addCollectionType = async (values: any) => {
        try {
            setIsSaving(true);
            await axios.post('http://localhost:8000/api/types', values);
            setIsAddModalVisible(false);
            getCollectionTypes();
            message.success(t('collectionTypes.list.add-success'));
        } catch (error) {
            message.error(t('common.messages.error'));
        } finally {
            setIsSaving(false);
        }
    };

    const editCollectionType = async (values: any) => {
        try {
            setIsSaving(true);
            await axios.put(`http://localhost:8000/api/types/${selectedType?.id}/attributes`, values);
            setIsAddModalVisible(false);
            getCollectionTypes();
            message.success(t('collectionTypes.list.edit-success'));
            setSelectedType(undefined);
        } catch (error) {
            message.error(t('common.messages.error'));
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        getCollectionTypes();
        // eslint-disable-next-line
    }, []);

    const handleCollectionTypeAddingCancel = async () => {
        setIsAddModalVisible(false);
        addForm.resetFields();
    };

    const handleCollectionTypeEditingCancel = async () => {
        setIsAddModalVisible(false);
        addForm.resetFields();
        setSelectedType(undefined);
    };

    const formattedData = useMemo(() => data.map(item => ({
        id: item.id,
        typeName: item.typeName || ''
    })), [data]);

    const columns = [
        {
          title: t('collectionTypes.list.table.columns.name'),
          dataIndex: 'typeName',
          key: 'typeName',
          className: 'column-name'
        },
        {
            title: t('common.labels.actions'),
            className: 'column-actions',
            render: (row: any) => (
                <Space size="middle">
                    <Link onClick={async () => {
                        const attributes = await axios.get(`http://localhost:8000/api/types/${row.id}/attributes`);

                        setSelectedType({
                            id: row.id,
                            typeName: row.typeName,
                            attributes: attributes.data
                        });

                        addForm.setFieldsValue({
                            typeName: row.typeName,
                            attributes: attributes.data.map((item: any) => (
                                {
                                    "id": item.id,
                                    "attributeName": item.attributeName,
                                    "attributeType": item.attributeType,
                                    "collection_type_id": item.collection_type_id
                                }
                            )) || []
                        });
                        setIsAddModalVisible(true);
                    }}>
                        { t('common.actions.edit') }
                    </Link>
                    <Link onClick={() => deleteCollectionType(row.id, row.typeName)}>
                        { t('common.actions.delete') }
                    </Link>
                </Space>
            )
        }
    ];

    return (
        <div ref={reference} css={styles}>
            <div className="top-row">
                <Breadcrumb>
                    <Breadcrumb.Item key="collection-types">{ t('collectionTypes.list.title') }</Breadcrumb.Item>
                </Breadcrumb>
                <Button
                    type="primary"
                    onClick={() => {
                        setIsAddModalVisible(true);
                        addForm.resetFields();
                    }}
                >
                    { t('common.actions.add') }
                </Button>
            </div>
            {
                isLoading ? (
                    <div className="load-spinner">
                        <Spin />
                    </div>
                ) : (
                    <Table dataSource={formattedData} columns={columns} />
                )
            }
            <Modal
                title={!!selectedType ? t('collectionTypes.list.edit-collection-type') : t('collectionTypes.list.add-collection-type')}
                visible={isAddModalVisible}
                onOk={() => {
                    if (!!selectedType) {
                        addForm.validateFields()
                        .then(values => {
                            editCollectionType({ ...values, attributes: values.attributes || [] });
                        })
                        .catch(error => {});
                    } else {
                        addForm.validateFields()
                        .then(values => {
                            addCollectionType({ ...values, attributes: values.attributes || [] });
                        })
                        .catch(error => {});
                    }
                }}
                onCancel={!!selectedType ? handleCollectionTypeEditingCancel : handleCollectionTypeAddingCancel}
                okText={!!selectedType ? t('common.actions.save') : t('common.actions.add')}
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
                        <Col xs={24}>
                            <Form.Item
                                name="typeName"
                                label={t('collectionTypes.list.add-form.fields.name.label')}
                                rules={[
                                    {
                                        required: true,
                                        message: t('collectionTypes.list.add-form.fields.name.validation'),
                                    }
                                ]}
                            >
                                <Input placeholder={t('collectionTypes.list.add-form.fields.name.placeholder')} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[24, 24]}>
                        <Col xs={24}>
                            <div className="attributes-label">{ t('collectionTypes.list.add-form.fields.attributes.label') }</div>
                            <Form.List name="attributes">
                                {(fields, { add, remove }) => (
                                    <>
                                        {
                                            fields.map(({ key, name, fieldKey, ...restField }) => (
                                                <Space key={key} align="baseline">
                                                    <div className="field-wrapper">
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'attributeName']}
                                                            fieldKey={[fieldKey, 'attributeName']}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: t('collectionTypes.list.add-form.fields.attributes.subfields.attr-name.validation')
                                                                }
                                                            ]}
                                                        >
                                                            <Input placeholder={t('collectionTypes.list.add-form.fields.attributes.subfields.attr-name.placeholder')} />
                                                        </Form.Item>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'attributeType']}
                                                            fieldKey={[fieldKey, 'attributeType']}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: t('collectionTypes.list.add-form.fields.attributes.subfields.attr-type.validation')
                                                                }
                                                            ]}
                                                        >
                                                            <Select placeholder={t('collectionTypes.list.add-form.fields.attributes.subfields.attr-type.placeholder')}>
                                                                {
                                                                    Object.keys(ATTRIBUTE_DATA_TYPES).map(key => (
                                                                        <Option key={key} value={ATTRIBUTE_DATA_TYPES[key]}>
                                                                            { t(`common.constants.attribute-data-types.${ATTRIBUTE_DATA_TYPES[key]}`) }
                                                                        </Option>
                                                                    ))
                                                                }
                                                            </Select>
                                                        </Form.Item>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'id']}
                                                            fieldKey={[fieldKey, 'id']}
                                                            hidden={true}
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'collection_type_id']}
                                                            fieldKey={[fieldKey, 'collection_type_id']}
                                                            hidden={true}
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </div>
                                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                                </Space>
                                            ))
                                        }
                                        <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            { t('collectionTypes.list.add-form.buttons.add-new') }
                                        </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default CollectionTypeList;