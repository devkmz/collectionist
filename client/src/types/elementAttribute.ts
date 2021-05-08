import { AttributeDataType } from "./attribute";

export type ElementAttribute = {
    element_id: number;
    attribute_id: number;
    value?: string | number;
    attributeName?: string;
    attributeType: AttributeDataType;
}