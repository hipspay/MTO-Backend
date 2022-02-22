export interface Payload {
    address: string;
    role: 'customer' | 'merchant' | 'agent' | 'admin';
    id: number;
}
