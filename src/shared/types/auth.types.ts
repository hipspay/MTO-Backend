export type Role = 'merchant' |'customer' | 'agent' | 'admin';
export interface Payload {
    address: string;
    role:  'merchant' | 'customer' | 'agent' | 'admin';
    id: number;
}
