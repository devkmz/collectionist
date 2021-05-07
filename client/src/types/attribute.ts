export type AttributeDataType = 
    'TEXT' |
    'NUMBER' |
    'DATE' |
    'LOCATION';

export type Attribute = {
    id: number;
    attributeName: string;
    attributeType: AttributeDataType;
    collection_type_id: number;
    value?: any;
}