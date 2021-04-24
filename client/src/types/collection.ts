export type Collection = {
    id: number;
    name: string;
    description: string;
    collection_type_id: number;
    image?: {
        id: number;
        name: string;
        url: string;
    };
    createdAt?: string;
    updatedAt?: string;
}