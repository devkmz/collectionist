import { Attribute } from "./attribute";

export type CollectionType = {
    id: number;
    typeName: string;
    attributes?: Array<Attribute>;
}