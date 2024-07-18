type JSON_OBJECT = Record<string, any>;
export default class PayloadModule {
    domain: string;
    create: any;
    validate: any;
    validateContext: any;
    validateProvider: any;
    validateMessage: any;
    constructor(domain: string);
    createProvider: (session: any, data: any) => void;
    buildTags: (tags: any) => ({
        list: {
            descriptor: {
                code: string;
            };
            value: any;
        }[];
        display?: undefined;
        descriptor: {
            code: string;
        };
    } | {
        list: {
            descriptor: {
                code: string;
            };
            value: any;
        }[];
        display: any;
        descriptor: {
            code: string;
        };
    })[];
    test: () => void;
    createItem: (data: any) => void;
    buildContext: (session: any, action: any) => {};
    createNestedField: (obj: JSON_OBJECT, path: string, value: any) => void;
}
export declare const dummyModule: PayloadModule;
export {};
