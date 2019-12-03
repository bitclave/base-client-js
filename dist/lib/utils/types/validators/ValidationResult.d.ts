export declare enum WalletVerificationCodes {
    ADDRESS_NOT_VERIFIED = "ADDRESS_NOT_VERIFIED",
    WRONG_SIGNATURE = "WRONG_SIGNATURE",
    SCHEMA_MISSMATCH = "SCHEMA_MISSMATCH",
    GENERAL_ERROR = "GENERAL_ERROR"
}
export declare class ValidationResult<T> {
    readonly data: T;
    readonly state: Array<WalletVerificationCodes>;
    readonly message: Array<string>;
    constructor(data: T, state: Array<WalletVerificationCodes>, message: Array<string>);
}
