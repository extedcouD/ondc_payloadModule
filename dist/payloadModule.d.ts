type JSON_OBJECT = Record<string, any>;
import { IBuildItemPayload, IDescriptor, IBuildDescriptorPayload, ICategory, IBuildCategoriesPayload, IBuildProviderPayload, IItem, IBuildXinputPayload, IXinput, IPayment, IBuildPaymentPayload, IBuildPaymentParamsPayload, IBuildContextPayload, IContextStructrue } from "./interface/index";
import IFis12 from "./interface/fis12/index";
declare class fis12 implements IFis12 {
    context: IContextStructrue;
    message: any;
    constructor();
    contextValidation: (session: any, context: any) => void;
    buildTags: (tags: any) => any;
    buildContext: ({ bap_id, bap_uri, bpp_id, bpp_uri, ttl, version, domain, transaction_id, countryCode, cityCode, action, }: IBuildContextPayload) => any;
    createNestedField: (obj: JSON_OBJECT, path: string, value: any) => void;
    buildXinput: ({ formName, formheading, formId, formUrl, formType, isResubmit, isMultipleSubmission, }: IBuildXinputPayload) => IXinput;
    buildIntent: ({ name }: {
        name: string;
    }) => {
        category: {
            descriptor: IDescriptor;
        };
    };
    buildCategories: ({ id, name, code }: IBuildCategoriesPayload) => ICategory[];
    buildDescriptor: ({ name, code, short_desc, long_desc, imageData, }: IBuildDescriptorPayload) => IDescriptor;
    buildProvider: ({ id, categories, tags }: IBuildProviderPayload) => any;
    buildItem: ({ id, name, code, categoryIDs, tags, isMatched, isRecommended, xinput, }: IBuildItemPayload) => IItem;
    buildPayment: ({ collectedBy, tags, params, type, status, id, }: IBuildPaymentPayload) => IPayment;
    buildPaymentParams: ({ bankCode, accountNumber, virtualPaymentAddress, }: IBuildPaymentParamsPayload) => {
        bank_code: string;
        bank_account_number: string;
        virtual_payment_address: string;
    };
}
declare const ondc: {
    beckn: {
        FIS12: fis12;
    };
};
export default ondc;
