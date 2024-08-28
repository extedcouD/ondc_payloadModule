import { v4 as uuidv4 } from "uuid";
type JSON_OBJECT = Record<string, any>;

import {
  IBuildItemPayload,
  IDescriptor,
  IBuildDescriptorPayload,
  ICategory,
  IBuildCategoriesPayload,
  IBuildProviderPayload,
  IItem,
  IBuildXinputPayload,
  IXinput,
  IPayment,
  IBuildPaymentPayload,
  IBuildPaymentParamsPayload,
  IBuildContextPayload,
  IContextStructrue,
} from "./interface/index";

import IFis12 from "./interface/fis12/index";

class fis12 implements IFis12 {
  context: IContextStructrue;
  message: any;

  constructor() {
    this.context = { create: this.buildContext };
    this.message = {
      intent: {
        category: {
          create: this.buildIntent,
        },
        provider: {
          create: this.buildProvider,
        },
        payment: {
          create: this.buildPayment,
        },
      },
      order: {
        provider: {
          create: this.buildProvider,
        },
        items: {
          create: this.buildItem,
        },
        payment: {
          create: this.buildPayment,
        },
      },
    };
  }

  contextValidation = (session: any, context: any) => {
    context = {
      bap_id: "fis-buyer-staging.ondc.org",
      bpp_id: "pramaan.ondc.org/beta/staging/mock/seller",
      bpp_uri: "https://pramaan.ondc.org/beta/staging/mock/seller",
      location: {
        country: {
          code: "IND",
        },
        city: {
          code: "*",
        },
      },
      transaction_id: "495f4a97-9e12-43dd-acc2-7e61a72f202f",
      message_id: "08e4fb14-01c2-4445-8700-3652dc54324b",
      timestamp: "2024-06-28T04:17:54.772Z",
      domain: "ONDC:FIS12",
      version: "2.1.0",
      ttl: "PT10M",
      action: "on_status",
      bap_uri: "https://4c16-59-145-217-117.ngrok-free.app/ondc",
    };

    session = {
      allMessageIds: ["08e4fb14-01c2-4445-8700-3652dc54324b"],
      lastTimestamp: new Date().toISOString(),
    };

    const SERVER_TYPE = process.env.SERVER_TYPE;
    const SUBSCRIBER_ID = process.env.SUBSCRIBER_ID;
    const SUBSCRIBER_URL = process.env.SUBSCRIBER_URL;
    const action = context.action;

    const errors: any = [];

    try {
      Object.entries(context).forEach((item: any) => {
        console.log("item", item);
        const [key, value] = item;

        switch (key) {
          case "bap_id":
            if (
              (action !== "search" || action !== "on_search") &&
              ((SERVER_TYPE === "BAP" && value !== SUBSCRIBER_ID) ||
                (SERVER_TYPE === "BPP" && value !== session.bap_id))
            ) {
              errors.push(
                `bap_id should be equal to ${
                  SERVER_TYPE === "BAP" ? SUBSCRIBER_ID : session.bap_id
                }`
              );
            }
            return;
          case "bap_uri":
            if (
              (action !== "search" || action !== "on_search") &&
              ((SERVER_TYPE === "BAP" && value !== SUBSCRIBER_URL) ||
                (SERVER_TYPE === "BPP" && value !== session.bap_uri))
            ) {
              errors.push(
                `bap_uri should be equal to ${
                  SERVER_TYPE === "BAP" ? SUBSCRIBER_URL : session.bap_uri
                }`
              );
            }
            return;
          case "bpp_id":
            if (
              (action !== "search" || action !== "on_search") &&
              ((SERVER_TYPE === "BPP" && value !== SUBSCRIBER_ID) ||
                (SERVER_TYPE === "BAP" && value !== session.bpp_id))
            ) {
              errors.push(
                `bpp_id should be equal to ${
                  SERVER_TYPE === "BPP" ? SUBSCRIBER_ID : session.bap_id
                }`
              );
            }
            return;
          case "bpp_uri":
            if (
              (action !== "search" || action !== "on_search") &&
              ((SERVER_TYPE === "BPP" && value !== SUBSCRIBER_URL) ||
                (SERVER_TYPE === "BAP" && value !== session.bpp_uri))
            ) {
              errors.push(
                `bpp_uri should be equal to ${
                  SERVER_TYPE === "BPP" ? SUBSCRIBER_URL : session.bap_uri
                }`
              );
            }
            return;
          case "location":
            if (
              !value?.country?.code ||
              value.country.code !== session.country
            ) {
              errors.push(
                `location.country.code should be equal to ${session.country}`
              );
            }
            if (!value?.city?.code || value.city.code !== session.cityCode) {
              errors.push(
                `location.city.code should be equal to ${session.country}`
              );
            }
            return;
          case "transaction_id":
            return;
          case "message_id":
            if (session.allMessageIds.includes(value)) {
              errors.push(
                `${value} already used as a message_id in previous transaction.`
              );
            }
            session.allMessageIds.push(value);
            return;
          case "timestamp":
            if (
              session?.lastTimestamp &&
              new Date(value) < new Date(session.lastTimestamp)
            ) {
              errors.push(
                `timestamp should be greater then last call. current call: ${value}, last call: ${session.lastTimestamp}`
              );
            }

            session.lastTimestamp = value;
            return;
          case "domain":
            if (value !== session.domain) {
              errors.push(`doamin should be equal to ${session.domain}`);
            }
            return;
          case "version":
            if (value !== session.version) {
              errors.push(`doamin should be equal to ${session.version}`);
            }
            return;
          case "ttl":
            if (value !== session.ttl) {
              errors.push(`doamin should be equal to ${session.ttl}`);
            }
            return;
          case "action":
            return;
          default:
            errors.push(`Additional field found in context: ${key}`);
        }
      });

      console.log("Errors: ", errors);
    } catch (e) {
      console.log("error", e);
    }
  };

  buildTags = (tags: any): any => {
    return Object.keys(tags).map((key) => {
      const subObject = tags[key];

      let display =
        subObject["display"] === undefined
          ? {}
          : { display: subObject["display"] };
      delete subObject["display"];
      const list = Object.keys(subObject).map((subKey) => {
        const value = subObject[subKey];
        return {
          descriptor: {
            code: subKey,
          },
          value: typeof value === "string" ? value : value.toString(),
        };
      });

      return {
        descriptor: {
          code: key,
        },
        ...display,
        list: list,
      };
    });
  };

  buildContext = ({
    bap_id,
    bap_uri,
    bpp_id,
    bpp_uri,
    ttl,
    version,
    domain,
    transaction_id,
    countryCode,
    cityCode,
    action,
  }: IBuildContextPayload) => {
    const context: any = {};

    if (bap_id) context.bap_id = bap_id;
    if (bap_uri) context.bap_uri = bap_uri;
    if (bpp_id) context.bpp_id = bpp_id;
    if (bpp_uri) context.bpp_uri = bpp_uri;
    context.ttl = ttl;
    context.version = version;
    context.domain = domain;
    context.transaction_id = transaction_id;
    context.location = {};
    if (countryCode)
      context.location = {
        country: {
          code: countryCode,
        },
      };
    if (cityCode)
      context.location = {
        ...context.location,
        city: {
          code: cityCode,
        },
      };

    context.message_id = uuidv4();
    context.timestamp = new Date().toISOString();
    context.action = action;

    return context;
  };

  createNestedField = (obj: JSON_OBJECT, path: string, value: any) => {
    const keys = path.split(".");
    let currentObj = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      const isArrayIndex = /\[\d+\]/.test(key); // Check if the key represents an array index

      if (isArrayIndex) {
        const arrayKey = key.substring(0, key.indexOf("["));

        const i = key.match(/\[(\d+)\]/);
        if (!i) throw new Error("Invalid array index");
        const index = parseInt(i[0], 10);

        if (!currentObj[arrayKey]) {
          currentObj[arrayKey] = [];
        }

        if (!currentObj[arrayKey][index]) {
          currentObj[arrayKey][index] = {};
        }

        currentObj = currentObj[arrayKey][index];
      } else {
        if (!currentObj[key]) {
          currentObj[key] = {};
        }
        currentObj = currentObj[key];
      }
    }

    currentObj[keys[keys.length - 1]] = value;
  };

  buildXinput = ({
    formName,
    formheading,
    formId,
    formUrl,
    formType,
    isResubmit,
    isMultipleSubmission,
  }: IBuildXinputPayload): IXinput => {
    const xinput: IXinput = {
      form: {
        id: formId,
      },
    };

    if (formName && formheading) {
      const head: any = {};

      head.descriptor = {};
      head.descriptor.name = formName;

      head.headings = formheading;

      xinput.head = head;
    }

    return xinput;
  };

  buildIntent = ({ name }: { name: string }) => {
    return {
      category: {
        descriptor: this.buildDescriptor({ name }),
      },
    };
    1;
  };

  buildCategories = ({ id, name, code }: IBuildCategoriesPayload) => {
    let categories: ICategory[] = [];

    for (let i = 0; i < id.length; i++) {
      let category: ICategory = {
        id: id[0],
      };

      if (name && name[i] && code && code[i]) {
        category.descriptor = this.buildDescriptor({
          name: name[i],
          code: code[i],
        });
      }

      categories.push(category);
    }

    return categories;
  };

  buildDescriptor = ({
    name,
    code,
    short_desc,
    long_desc,
    imageData,
  }: IBuildDescriptorPayload): IDescriptor => {
    return {
      ...(name && { name }),
      ...(code && { code }),
      ...(short_desc && long_desc && { short_desc, long_desc }),
      ...(imageData && { image: imageData }),
    };
  };

  buildProvider = ({ id, categories, tags }: IBuildProviderPayload): any => {
    return {
      id,
      ...(categories && {
        categories: this.buildCategories({ ...categories }),
      }),
      ...(tags && { tags: this.buildTags(tags) }),
    };
  };

  buildItem = ({
    id,
    name,
    code,
    categoryIDs,
    tags,
    isMatched,
    isRecommended,
    xinput,
  }: IBuildItemPayload): IItem => {
    return {
      id,
      ...(name &&
        code && {
          descriptor: this.buildDescriptor({ name: name, code: code }),
        }),
      ...(categoryIDs && { category_ids: categoryIDs }),
      ...(tags && { tags: this.buildTags(tags) }),
      ...(isMatched && { matched: isMatched }),
      ...(isRecommended && { recommended: isRecommended }),
      ...(xinput && { xinput: this.buildXinput({ ...xinput }) }),
    };
  };

  buildPayment = ({
    collectedBy,
    tags,
    params,
    type,
    status,
    id,
  }: IBuildPaymentPayload): IPayment => {
    return {
      collected_by: collectedBy,
      tags: this.buildTags(tags),
      ...(id && { id: id }),
      ...(status && { status: status }),
      ...(type && { type: type }),
      ...(params && { params: this.buildPaymentParams({ ...params }) }),
    };
  };

  buildPaymentParams = ({
    bankCode,
    accountNumber,
    virtualPaymentAddress,
  }: IBuildPaymentParamsPayload) => {
    return {
      bank_code: bankCode,
      bank_account_number: accountNumber,
      virtual_payment_address: virtualPaymentAddress,
    };
  };
}

const ondcFIS12 = new fis12();

const ondc = {
  beckn: {
    FIS12: ondcFIS12,
  },
};

export default ondc;
