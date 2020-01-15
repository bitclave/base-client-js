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

    afterEach(async () => {
        TimeMeasureLogger.enableLogger(false);
        TimeMeasureLogger.clearCollectedMeasure();
    });

    it('should has true order (tree) of logs', async () => {
        TimeMeasureLogger.enableLogger(true);
        const rnd = Math.random();

        TimeMeasureLogger.time('test1', rnd);
        TimeMeasureLogger.time('test2', rnd);
        TimeMeasureLogger.timeEnd('test2', rnd);
        TimeMeasureLogger.timeEnd('test1', rnd);

        TimeMeasureLogger.time('test3', rnd);
        TimeMeasureLogger.time('test4', rnd);
        TimeMeasureLogger.time('test6', rnd);
        TimeMeasureLogger.timeEnd('test6', rnd, 6);
        TimeMeasureLogger.time('test5', rnd);
        TimeMeasureLogger.time('test7', rnd);
        TimeMeasureLogger.timeEnd('test7', rnd, 7);
        TimeMeasureLogger.time('test8', rnd);
        TimeMeasureLogger.timeEnd('test8', rnd, 8);
        TimeMeasureLogger.timeEnd('test5', rnd, 5);
        TimeMeasureLogger.timeEnd('test4', rnd, 4);
        TimeMeasureLogger.timeEnd('test3', rnd, 3);
        TimeMeasureLogger.enableLogger(false);
    });

    it('should disable time measure by default', async () => {
        const user = await BaseClientHelper.createRegistered(passPhraseAlisa);

        const rnd = Math.random();
        TimeMeasureLogger.time('test', rnd);
        await user.profileManager.updateData(new Map<string, string>());
        TimeMeasureLogger.timeEnd('test', rnd);

        const result = await user.timeMeasureManager.getCollectedMeasure();
        result.should.be.empty;
    });

    it('should enable time measure and collect info', async () => {
        const user = await BaseClientHelper.createRegistered(passPhraseAlisa);
        await user.timeMeasureManager.enableLogger(true);

        const rnd = Math.random();

        TimeMeasureLogger.time('test', rnd);
        await user.profileManager.updateData(new Map<string, string>());
        TimeMeasureLogger.timeEnd('test', rnd);

        const result = await user.timeMeasureManager.getCollectedMeasure();
        result.should.be.not.empty;
    });

    it('should clear collection', async () => {
        const user = await BaseClientHelper.createRegistered(passPhraseAlisa);
        await user.timeMeasureManager.enableLogger(true);
        const rnd = Math.random();

        TimeMeasureLogger.time('test', rnd);
        await user.profileManager.updateData(new Map<string, string>());
        TimeMeasureLogger.timeEnd('test', rnd);

        let result = await user.timeMeasureManager.getCollectedMeasure();
        result.should.be.not.empty;

        await user.timeMeasureManager.clearCollectedMeasure();
        result = await user.timeMeasureManager.getCollectedMeasure();
        result.should.be.empty;
    });
});
