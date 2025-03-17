import { AuthLink, AuthOptions, AUTH_TYPE, USER_AGENT_HEADER, USER_AGENT } from './auth-link';
export declare const createAuthLink: ({ url, region, auth }: {
    url: string;
    region: string;
    auth: AuthOptions;
}) => AuthLink;
export { AuthLink, AuthOptions, AUTH_TYPE, USER_AGENT_HEADER, USER_AGENT };
export { Signer } from './signer';
