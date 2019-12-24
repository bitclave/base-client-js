import { Storage } from './Storage';
export declare class LocalStorageImpl implements Storage {
    setItem(key: string, value: string): void;
    getItem(key: string): string;
}
