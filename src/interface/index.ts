import { status } from "aws-sdk/clients/iotfleetwise";

export interface context {
  bap_id: string;
}

interface IImage {
  url: string;
  size_type?: string;
}

export interface IDescriptor {
  code?: string;
  name?: string;
  short_desc?: string;
  long_desc?: string;
  image?: IImage[];
}

export interface IXinputHead {
  descriptor: IDescriptor;
  index: any;
  headings: string[];
}

export interface ICategory {
  id: string;
  descriptor?: IDescriptor;
}

export interface IItem {
  id: string;
  descriptor?: IDescriptor;
  category_ids?: string[];
  tags?: ITags[];
  matched?: boolean;
  recommended?: boolean;
  xinput?: IXinput;
}

export interface IXinput {
  head?: IXinputHead;
  form: IXinputForm;
  required?: boolean;
}

export interface IXinputForm {
  id: string;
  mime_type?: string;
  url?: string;
  resubmit?: boolean;
  multiple_sumbissions?: boolean;
}

export interface IPayment {
  id?: string;
  collected_by: string;
  type?: string;
  status?: string;
  params?: IPaymentParam;
  tags: ITags;
}

interface IPaymentParam {
  bank_code?: string;
  bank_account_number?: string;
  virtual_payment_address?: string;
}

export interface ITags {
  descriptor: IDescriptor;
  list: ITagsList[];
}

interface ITagsList {
  descriptor: IDescriptor;
  value: string;
}

// Payload
export interface IBuildItemPayload {
  id: string;
  name?: string;
  code?: string;
  categoryIDs?: string[];
  tags: any;
  isMatched?: boolean;
  isRecommended?: boolean;
  xinput?: IBuildXinputPayload;
}

export interface IBuildXinputPayload {
  formName: string;
  formheading: string[];
  formId: string;
  formUrl?: string;
  formType?: string;
  isResubmit?: boolean;
  isMultipleSubmission?: boolean;
}
export interface IBuildDescriptorPayload {
  name: string;
  code?: string;
  short_desc?: string;
  long_desc?: string;
  imageData?: IImage[];
}

export interface IBuildCategoriesPayload {
  id: string[];
  name?: string[];
  code?: string[];
}

export interface IBuildProviderPayload {
  id: string;
  categories?: IBuildCategoriesPayload;
  tags?: any;
}

export interface IBuildPaymentPayload {
  collectedBy: string;
  tags: any;
  id?: string;
  type?: string;
  status?: status;
  params?: IBuildPaymentParamsPayload;
}

export interface IBuildPaymentParamsPayload {
  bankCode: string;
  accountNumber: string;
  virtualPaymentAddress: string;
}

export interface IBuildContextPayload {
  bap_id?: string;
  bap_uri?: string;
  bpp_id?: string;
  bpp_uri?: string;
  ttl: string;
  version: string;
  domain: string;
  transaction_id: string;
  countryCode: string;
  cityCode: string;
  action: string;
}

// call structure

export interface IContextStructrue {
  create: ({}: IBuildContextPayload) => any;
}
