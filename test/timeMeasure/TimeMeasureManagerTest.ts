// tslint:disable:no-unused-expression
import * as chai from 'chai';
import { TimeMeasureLogger } from '../../src/Base';
import { BaseClientHelper } from '../BaseClientHelper';

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised).should();

describe('Time Measure Manager', async () => {
    const passPhraseAlisa: string = 'I\'m Alisa. This is my secret password';

    beforeEach(async () => {
        TimeMeasureLogger.enableLogger(false);
        TimeMeasureLogger.clearCollectedMeasure();
    });

    afterEach(async  ()=> {
        TimeMeasureLogger.enableLogger(false);
        TimeMeasureLogger.clearCollectedMeasure();
    });

    it('should has true order (tree) of logs', async () => {
        TimeMeasureLogger.enableLogger(true);
        TimeMeasureLogger.time('test1');
        TimeMeasureLogger.time('test2');
        TimeMeasureLogger.timeEnd('test2');
        TimeMeasureLogger.timeEnd('test1');

        TimeMeasureLogger.time('test3');
        TimeMeasureLogger.time('test4');
        TimeMeasureLogger.time('test6');
        TimeMeasureLogger.timeEnd('test6', 6);
        TimeMeasureLogger.time('test5');
        TimeMeasureLogger.time('test7');
        TimeMeasureLogger.timeEnd('test7', 7);
        TimeMeasureLogger.time('test8');
        TimeMeasureLogger.timeEnd('test8', 8);
        TimeMeasureLogger.timeEnd('test5', 5);
        TimeMeasureLogger.timeEnd('test4', 4);
        TimeMeasureLogger.timeEnd('test3', 3);
        TimeMeasureLogger.enableLogger(false);
    });

    it('should disable time measure by default', async () => {
        const user = await BaseClientHelper.createRegistered(passPhraseAlisa);
        TimeMeasureLogger.time('test');
        await user.profileManager.updateData(new Map<string, string>());
        TimeMeasureLogger.timeEnd('test');

        const result = await user.timeMeasureManager.getCollectedMeasure();
        result.should.be.empty;
    });

    it('should enable time measure and collect info', async () => {
        const user = await BaseClientHelper.createRegistered(passPhraseAlisa);
        await user.timeMeasureManager.enableLogger(true);

        TimeMeasureLogger.time('test');
        await user.profileManager.updateData(new Map<string, string>());
        TimeMeasureLogger.timeEnd('test');

        const result = await user.timeMeasureManager.getCollectedMeasure();
        result.should.be.not.empty;
    });

    it('should clear collection', async () => {
        const user = await BaseClientHelper.createRegistered(passPhraseAlisa);
        await user.timeMeasureManager.enableLogger(true);

        TimeMeasureLogger.time('test');
        await user.profileManager.updateData(new Map<string, string>());
        TimeMeasureLogger.timeEnd('test');

        let result = await user.timeMeasureManager.getCollectedMeasure();
        result.should.be.not.empty;

        await user.timeMeasureManager.clearCollectedMeasure();
        result = await user.timeMeasureManager.getCollectedMeasure();
        result.should.be.empty;
    });
});
