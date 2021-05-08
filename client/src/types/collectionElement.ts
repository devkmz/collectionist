import { ElementAttribute } from "./elementAttribute";

export type CollectionElement = {
    id: number;
    elementName: string;
    elementDescription: string;
    collection_id: number;
    elementImage?: {
        id: number;
        name: string;
        url: string;
    };
    elements_attributes?: Array<ElementAttribute>;
}