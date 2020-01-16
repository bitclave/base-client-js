import { BaseClientHelper } from './BaseClientHelper';

after(async () => {
    await BaseClientHelper.deleteAllCreatedUsers();
});
