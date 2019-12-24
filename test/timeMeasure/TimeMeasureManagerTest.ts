// tslint:disable:no-unused-expression
import * as chai from 'chai';
import { TimeMeasureLogger } from '../../src/Base';
import { BaseClientHelper } from '../BaseClientHelper';

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised).should();

describe('Time Measure Manager', async () => {
    const passPhraseAlisa: string = 'I\'m Alisa. This is my secret password';

    it('should disable time measure by default', async () => {
        const user = await BaseClientHelper.createRegistered(passPhraseAlisa);
        TimeMeasureLogger.time('test');
        await user.profileManager.updateData(new Map<string, string>());
        TimeMeasureLogger.timeEnd('test');

        const result = await user.timeMeasureManager.getCollectedMeasure();
        Array.from(result.keys()).should.be.empty;
    });

    it('should enable time measure and collect info', async () => {

        const user = await BaseClientHelper.createRegistered(passPhraseAlisa);
        await user.timeMeasureManager.enableLogger(true);

        TimeMeasureLogger.time('test');
        await user.profileManager.updateData(new Map<string, string>());
        TimeMeasureLogger.timeEnd('test');

        const result = await user.timeMeasureManager.getCollectedMeasure();
        Array.from(result.keys()).should.be.not.empty;
    });

    it('should clear collection', async () => {

        const user = await BaseClientHelper.createRegistered(passPhraseAlisa);
        await user.timeMeasureManager.enableLogger(true);

        TimeMeasureLogger.time('test');
        await user.profileManager.updateData(new Map<string, string>());
        TimeMeasureLogger.timeEnd('test');

        let result = await user.timeMeasureManager.getCollectedMeasure();
        Array.from(result.keys()).should.be.not.empty;

        await user.timeMeasureManager.clearCollectedMeasure();
        result = await user.timeMeasureManager.getCollectedMeasure();
        Array.from(result.keys()).should.be.empty;
    });
});
