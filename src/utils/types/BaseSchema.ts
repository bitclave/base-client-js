const Ajv = require('ajv');
import { AddrRecord, BaseAddrPair, WalletsRecords } from './BaseTypes';

export class BaseSchemaField {
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

export class BaseSchemaFieldObject {
    public readonly $ref: string;

    constructor($ref: string) {
        this.$ref = $ref;
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
        super('object', '', ['baseID', 'ethAddr'], false);
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
        '#/definitions/eth_address',
        1,
        true
    );
    public sig: BaseSchemaField = new BaseSchemaField();
}

export class BaseSchemaEthWalletDefinitions {
    public readonly recordPair: BaseSchemaAddPair;
    public readonly eth_address: BaseSchemaAddRecord;

    constructor(ethAddress: BaseSchemaAddRecord, recordPair: BaseSchemaAddPair) {
        this.eth_address = ethAddress;
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
    public readonly eth_address: BaseSchemaAddRecord;
    public readonly recordPair: BaseSchemaAddPair;
    public readonly eth_wallets: BaseSchemaEthWallet;

    constructor(ethAddress: BaseSchemaAddRecord, recordPair: BaseSchemaAddPair, ethWallets: BaseSchemaEthWallet) {
        this.eth_address = ethAddress;
        this.eth_wallets = ethWallets;
        this.recordPair = recordPair;
    }
}

export class BaseSchemaCombineProps {
    public readonly baseID: BaseSchemaField = new BaseSchemaField();
    public readonly email: BaseSchemaField = new BaseSchemaField();
    public readonly wealth: BaseSchemaField = new BaseSchemaField('string', 'wealth in USD');
    public readonly eth_wallets: BaseSchemaFieldObject = new BaseSchemaFieldObject('#/definitions/eth_wallets');
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

    private readonly ajvValidateAll: Function;
    private readonly ajvValidateAddr: Function;
    private readonly ajvValidateBaseAddrPair: Function;
    private readonly ajvValidateWallets: Function;

    private ajv: any;

    constructor() {
        this.ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

        this.ajvValidateBaseAddrPair = this.ajv.compile(BaseSchema.EthBaseAddrPair);
        this.ajvValidateAddr = this.ajv.compile(BaseSchema.EthAddrRecord);
        this.ajvValidateWallets = this.ajv.compile(BaseSchema.EthWallets);
        this.ajvValidateAll = this.ajv.compile(BaseSchema.All);
    }

    public validateAddr(addrRecord: AddrRecord): boolean {
        return this.ajvValidateAddr(addrRecord);
    }

    public validateWallets(walletsRecords: WalletsRecords): boolean {
        return this.ajvValidateWallets(walletsRecords);
    }

    public validateBaseAddrPair(baseAddrPair: BaseAddrPair): boolean {
        return this.ajvValidateBaseAddrPair(baseAddrPair);
    }

    public validateAll(s: any): boolean {
        return this.ajvValidateAll(s);
    }

}
