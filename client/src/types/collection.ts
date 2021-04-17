export type Collection = {
    id: number;
    name: string;
    description: string;
    type: string;
    image?: {
        id: number;
        name: string;
        url: string;
    };
    created_at?: string;
    updated_at?: string;
}