import { IBuildItemPayload, IDescriptor, IBuildDescriptorPayload, ICategory, IBuildCategoriesPayload, IBuildProviderPayload, IItem, IBuildXinputPayload, IXinput, IPayment, IBuildPaymentPayload, IBuildPaymentParamsPayload } from "../index";
export default interface IFis12 {
    context: any;
    message: any;
    buildTags: (tags: any) => any;
    buildContext: (session: any, action: any) => any;
    createNestedField: (obj: any, path: string, value: any) => void;
    buildXinput: (payload: IBuildXinputPayload) => IXinput;
    buildIntent: (payload: {
        name: string;
    }) => any;
    buildCategories: (payload: IBuildCategoriesPayload) => ICategory[];
    buildDescriptor: (payload: IBuildDescriptorPayload) => IDescriptor;
    buildProvider: (payload: IBuildProviderPayload) => any;
    buildItem: (payload: IBuildItemPayload) => IItem;
    buildPayment: (payload: IBuildPaymentPayload) => IPayment;
    buildPaymentParams: (payload: IBuildPaymentParamsPayload) => any;
}
