import { v4 as uuidv4 } from "uuid";
type JSON_OBJECT = Record<string, any>;

class PayloadModule {
  domain: string;
  create: any;
  validate: any;
  validateContext: any;
  validateProvider: any;
  validateMessage: any;

  constructor(domain: string) {
    this.domain = domain;

    this.create = {
      context: this.buildContext,
      message: {
        provider: this.createProvider,
        item: this.createItem,
      },
    };
    this.validate = {
      context: this.validateContext,
      message: {
        provider: this.validateProvider,
        item: this.validateMessage,
      },
    };
  }

  createProvider = (session: any, data: any) => {
    const payload: any = {};

    payload.id = data.providerId;

    if (session.providerDescription) {
      payload.descriptor = {
        image: [],
        name: session.providerDescription.name,
        short_desc: session.providerDescription.shortDesc,
        long_desc: session.providerDescription.longDesc,
      };
    }

    if (session.providerTags || data.providerTags) {
      payload.tags = this.buildTags(session.providerTags || data.providerTags);
    }
  };

  buildTags = (tags: any) => {
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

  test = () => {
    console.log("working>>>>>");
  };

  createItem = (data: any) => {
    console.log("creatring Item", data);
  };

  buildContext = (session: any, action: any) => {
    const contextConfig = [
  
      {
        beckn_key: "location.country.code",
        value: "session.country",
      },
      {
        beckn_key: "location.city.code",
        value: "session.cityCode",
      },
      {
        beckn_key: "transaction_id",
        value: "session.currentTransactionId",
      },

      {
        beckn_key: "domain",
        value: "session.domain",
      },
      {
        beckn_key: "version",
        value: "session.version",
      },
      {
        beckn_key: "ttl",
        value: "session.ttl",
      },

    ];
    const context: any = {};

    context.bap_id = session.bap_id
    context.bap_uri = session.bap_uri
    context.bpp_id = session.bap_id
    context.bpp_uri = session.bpp_uri
    context.message_id = uuidv4()
    context.timestamp = new Date().toISOString()
    context.action = action

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
}
const ondc: any =  {}
ondc.beckn = new PayloadModule("domain");
export default ondc
