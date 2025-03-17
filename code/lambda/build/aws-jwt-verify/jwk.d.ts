import { JsonFetcher } from "./https.js";
import { JwtHeader, JwtPayload } from "./jwt-model.js";
import { Json, JsonObject } from "./safe-json-parse.js";
interface DecomposedJwt {
    header: JwtHeader;
    payload: JwtPayload;
}
declare const optionalJwkFieldNames: readonly ["use", "alg", "kid", "n", "e"];
declare const mandatoryJwkFieldNames: readonly ["kty"];
declare type OptionalJwkFieldNames = typeof optionalJwkFieldNames[number];
declare type MandatoryJwkFieldNames = typeof mandatoryJwkFieldNames[number];
declare type OptionalJwkFields = {
    [key in OptionalJwkFieldNames]?: string;
};
declare type MandatoryJwkFields = {
    [key in MandatoryJwkFieldNames]: string;
};
export declare type Jwk = OptionalJwkFields & MandatoryJwkFields & JsonObject;
export declare type RsaSignatureJwk = Jwk & {
    use: "sig";
    kty: "RSA";
    n: string;
    e: string;
};
export declare type JwkWithKid = Jwk & {
    kid: string;
};
export declare function findJwkInJwks(jwks: Jwks, kid: string): JwkWithKid | undefined;
interface JwksFields {
    keys: readonly Jwk[];
}
export declare type Jwks = JwksFields & JsonObject;
export interface JwksCache {
    getJwk(jwksUri: string, decomposedJwt: DecomposedJwt): Promise<JwkWithKid>;
    getCachedJwk(jwksUri: string, decomposedJwt: DecomposedJwt): JwkWithKid;
    addJwks(jwksUri: string, jwks: Jwks): void;
    getJwks(jwksUri: string): Promise<Jwks>;
}
export declare function fetchJwks(jwksUri: string): Promise<Jwks>;
export declare function fetchJwk(jwksUri: string, decomposedJwt: DecomposedJwt): Promise<JwkWithKid>;
export declare function assertIsJwks(jwks: Json): asserts jwks is Jwks;
export declare function assertIsRsaSignatureJwk(jwk: Jwk): asserts jwk is RsaSignatureJwk;
export declare function assertIsJwk(jwk: Json): asserts jwk is Jwk;
export declare function isJwks(jwks: Json): jwks is Jwks;
export declare function isJwk(jwk: Json): jwk is Jwk;
export interface PenaltyBox {
    wait: (jwksUri: string, kid: string) => Promise<void>;
    registerFailedAttempt: (jwksUri: string, kid: string) => void;
    registerSuccessfulAttempt: (jwksUri: string, kid: string) => void;
}
export declare class SimplePenaltyBox implements PenaltyBox {
    waitSeconds: number;
    private waitingUris;
    constructor(props?: {
        waitSeconds?: number;
    });
    wait(jwksUri: string): Promise<void>;
    release(jwksUri: string): void;
    registerFailedAttempt(jwksUri: string): void;
    registerSuccessfulAttempt(jwksUri: string): void;
}
export declare class SimpleJwksCache implements JwksCache {
    fetcher: JsonFetcher;
    penaltyBox: PenaltyBox;
    private jwksCache;
    private fetchingJwks;
    constructor(props?: {
        penaltyBox?: PenaltyBox;
        fetcher?: JsonFetcher;
    });
    addJwks(jwksUri: string, jwks: Jwks): void;
    getJwks(jwksUri: string): Promise<Jwks>;
    getCachedJwk(jwksUri: string, decomposedJwt: DecomposedJwt): JwkWithKid;
    getJwk(jwksUri: string, decomposedJwt: DecomposedJwt): Promise<JwkWithKid>;
}
export {};
