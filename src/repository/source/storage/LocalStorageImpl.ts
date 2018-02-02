import { Storage } from './Storage';

let storage: any;

if (typeof localStorage === 'undefined' || localStorage === null) {
    const nodeStorage = require('node-localstorage').LocalStorage;
    storage = new nodeStorage('./scratch');
} else {
    storage = localStorage;
}

export default class LocalStorageImpl implements Storage {

    setItem(key: string, value: string): void {
        storage.setItem(key, value);
    }

    getItem(key: string): string {
        return storage.getItem(key);
    }

}