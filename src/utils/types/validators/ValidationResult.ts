export enum WalletVerificationCodes {
    ADDRESS_NOT_VERIFIED = 'ADDRESS_NOT_VERIFIED',
    WRONG_SIGNATURE = 'WRONG_SIGNATURE',
    SCHEMA_MISSMATCH = 'SCHEMA_MISSMATCH',
    GENERAL_ERROR = 'GENERAL_ERROR',
}

export class ValidationResult<T> {
    public readonly data: T;
    public readonly state: Array<WalletVerificationCodes>;
    public readonly message: Array<string>;

    constructor(
        data: T,
        state: Array<WalletVerificationCodes>,
        message: Array<string>
    ) {
        this.data = data;
        this.state = state;
        this.message = message;
    }
}
