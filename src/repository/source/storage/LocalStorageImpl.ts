import { Storage } from './Storage';

let storage: Storage;

if (typeof localStorage === 'undefined' || localStorage === null) {
    const nodeStorage = require('node-localstorage').LocalStorage;
    storage = new nodeStorage('./scratch');
} else {
    storage = localStorage;
}

export class LocalStorageImpl implements Storage {

    public setItem(key: string, value: string): void {
        storage.setItem(key, value);
    }

    public getItem(key: string): string {
        return storage.getItem(key) || '';
    }

}
