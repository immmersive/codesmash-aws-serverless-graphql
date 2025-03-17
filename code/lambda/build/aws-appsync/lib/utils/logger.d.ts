export declare type Logger = Function & {
    extend(category: string): Logger;
};
declare const debugLogger: Logger;
export default debugLogger;
