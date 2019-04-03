import * as Ajv from 'ajv';
import { RefParams, TypeParams } from 'ajv';
import { AddrRecord, BaseAddrPair, WalletsRecords } from './BaseTypes';

export class BaseSchemaField implements TypeParams {
    public readonly type: string;
    public readonly description?: string;
    public readonly required?: Array<string>;
    public readonly additionalProperties?: boolean;

    constructor(type?: string, description?: string, required?: Array<string>, additionalProperties?: boolean) {
        this.type = type || 'string';
        this.description = description;
        this.required = required;
        this.additionalProperties = additionalProperties;
    }
}

export class BaseSchemaFieldObject implements RefParams {
    public readonly ref: string;

    constructor(ref: string) {
        this.ref = ref;
    }
}

export class BaseSchemaFieldArray extends BaseSchemaField {
    public readonly items: BaseSchemaFieldObject;
    public readonly minItems: number;
    public readonly uniqueItems: boolean;

    constructor(itemDefinition: string, minItems: number, uniqueItems: boolean) {
        super('array');
        this.items = new BaseSchemaFieldObject(itemDefinition);
        this.minItems = minItems;
        this.uniqueItems = uniqueItems;
    }
}

export class BaseSchemaAddPairProps {
    public readonly baseID: BaseSchemaField = new BaseSchemaField();
    public readonly ethAddr: BaseSchemaField = new BaseSchemaField();
}

export class BaseSchemaAddPair extends BaseSchemaField {
    public readonly properties: BaseSchemaAddPairProps = new BaseSchemaAddPairProps();

    constructor() {
        super('object', '', ['baseID', 'ethAddr'], true);
    }
}

export class BaseSchemaAddRecordDefinitions {
    public readonly recordPair: BaseSchemaAddPair;

    constructor(recordPair: BaseSchemaAddPair) {
        this.recordPair = recordPair;
    }
}

export class BaseSchemaAddRecordProps {
    public readonly data: BaseSchemaFieldObject = new BaseSchemaFieldObject('#/definitions/recordPair');
    public readonly sig: BaseSchemaField = new BaseSchemaField();
}

export class BaseSchemaAddRecord extends BaseSchemaField {
    public readonly definitions: BaseSchemaAddRecordDefinitions;
    public readonly properties: BaseSchemaAddRecordProps = new BaseSchemaAddRecordProps();

    constructor(definitions: BaseSchemaAddRecordDefinitions) {
        super('object', '', ['data'], true);
        this.definitions = definitions;
    }
}

export class BaseSchemaEthWalletProps {
    public readonly data: BaseSchemaFieldArray = new BaseSchemaFieldArray(
        '#/definitions/ethAddress',
        1,
        true
    );
    public sig: BaseSchemaField = new BaseSchemaField();
}

export class BaseSchemaEthWalletDefinitions {
    public readonly recordPair: BaseSchemaAddPair;
    public readonly ethAddress: BaseSchemaAddRecord;

    constructor(ethAddress: BaseSchemaAddRecord, recordPair: BaseSchemaAddPair) {
        this.ethAddress = ethAddress;
        this.recordPair = recordPair;
    }
}

export class BaseSchemaEthWallet extends BaseSchemaField {
    public readonly definitions: BaseSchemaEthWalletDefinitions;
    public readonly description: string = 'list of ETH wallets';
    public readonly properties: BaseSchemaEthWalletProps = new BaseSchemaEthWalletProps();

    constructor(definitions: BaseSchemaEthWalletDefinitions) {
        super('object');
        this.definitions = definitions;
    }
}

export class BaseSchemaCombineDefinitions {
    public readonly ethAddress: BaseSchemaAddRecord;
    public readonly recordPair: BaseSchemaAddPair;
    public readonly ethWallets: BaseSchemaEthWallet;

    constructor(ethAddress: BaseSchemaAddRecord, recordPair: BaseSchemaAddPair, ethWallets: BaseSchemaEthWallet) {
        this.ethAddress = ethAddress;
        this.ethWallets = ethWallets;
        this.recordPair = recordPair;
    }
}

export class BaseSchemaCombineProps {
    public readonly baseID: BaseSchemaField = new BaseSchemaField();
    public readonly email: BaseSchemaField = new BaseSchemaField();
    public readonly wealth: BaseSchemaField = new BaseSchemaField('string', 'wealth in USD');
    // tslint:disable-next-line:variable-name
    public readonly eth_wallets: BaseSchemaFieldObject = new BaseSchemaFieldObject('#/definitions/ethWallets');
}

export class BaseSchemaCombine extends BaseSchemaField {
    public readonly definitions: BaseSchemaCombineDefinitions;
    public readonly properties: BaseSchemaCombineProps = new BaseSchemaCombineProps();

    constructor(definitions: BaseSchemaCombineDefinitions) {
        super('object', 'list of ETH wallets', ['baseID'], false);
        this.definitions = definitions;
    }
}

export class BaseSchema {

    public static EthBaseAddrPair: BaseSchemaAddPair = new BaseSchemaAddPair();

    public static EthAddrRecord: BaseSchemaAddRecord = new BaseSchemaAddRecord(
        new BaseSchemaAddRecordDefinitions(BaseSchema.EthBaseAddrPair)
    );

    public static EthWallets: BaseSchemaEthWallet = new BaseSchemaEthWallet(
        new BaseSchemaEthWalletDefinitions(BaseSchema.EthAddrRecord, BaseSchema.EthBaseAddrPair)
    );

    public static All: BaseSchemaCombine = new BaseSchemaCombine(
        new BaseSchemaCombineDefinitions(BaseSchema.EthAddrRecord, BaseSchema.EthBaseAddrPair, BaseSchema.EthWallets)
    );

    private readonly ajvValidateAddr: Ajv.ValidateFunction;
    private readonly ajvValidateBaseAddrPair: Ajv.ValidateFunction;
    private readonly ajvValidateWallets: Ajv.ValidateFunction;

    constructor() {
        const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

        this.ajvValidateBaseAddrPair = ajv.compile(BaseSchema.EthBaseAddrPair);
        this.ajvValidateAddr = ajv.compile(BaseSchema.EthAddrRecord);
        this.ajvValidateWallets = ajv.compile(BaseSchema.EthWallets);
    }

    public validateAddr(addrRecord: AddrRecord): boolean {
        return this.ajvValidateAddr(addrRecord) as boolean;
    }

    public validateWallets(walletsRecords: WalletsRecords): boolean {
        return this.ajvValidateWallets(walletsRecords) as boolean;
    }

    public validateBaseAddrPair(baseAddrPair: BaseAddrPair): boolean {
        return this.ajvValidateBaseAddrPair(baseAddrPair) as boolean;
    }

}
