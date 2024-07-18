"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var PayloadModule = /** @class */ (function () {
    function PayloadModule(domain) {
        var _this = this;
        this.createProvider = function (session, data) {
            var payload = {};
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
                payload.tags = _this.buildTags(session.providerTags || data.providerTags);
            }
        };
        this.buildTags = function (tags) {
            return Object.keys(tags).map(function (key) {
                var subObject = tags[key];
                var display = subObject["display"] === undefined
                    ? {}
                    : { display: subObject["display"] };
                delete subObject["display"];
                var list = Object.keys(subObject).map(function (subKey) {
                    var value = subObject[subKey];
                    return {
                        descriptor: {
                            code: subKey,
                        },
                        value: typeof value === "string" ? value : value.toString(),
                    };
                });
                return __assign(__assign({ descriptor: {
                        code: key,
                    } }, display), { list: list });
            });
        };
        this.test = function () {
            console.log("working>>>>>");
        };
        this.createItem = function (data) {
            console.log("creatring Item", data);
        };
        this.buildContext = function (session, action) {
            var contextConfig = [
                {
                    beckn_key: "bap_id",
                    value: "session.bap_id",
                },
                {
                    beckn_key: "bap_uri",
                    value: "session.bap_uri",
                },
                {
                    beckn_key: "bpp_id",
                    value: "session.bpp_id",
                },
                {
                    beckn_key: "bpp_uri",
                    value: "session.bpp_uri",
                },
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
                    beckn_key: "message_id",
                    value: "uuidv4()",
                },
                {
                    beckn_key: "timestamp",
                    value: "new Date().toISOString()",
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
                {
                    beckn_key: "action",
                    value: "action",
                },
            ];
            var context = {};
            contextConfig.map(function (item) {
                try {
                    if (eval(item.value) && (item.check ? eval(item.check) : true))
                        _this.createNestedField(context, item.beckn_key, item.compute ? eval(item.compute) : eval(item.value));
                }
                catch (err) {
                    console.info(item.value + " is undefined, will not be mapping that");
                }
            });
            return context;
        };
        this.createNestedField = function (obj, path, value) {
            var keys = path.split(".");
            var currentObj = obj;
            for (var i = 0; i < keys.length - 1; i++) {
                var key = keys[i];
                var isArrayIndex = /\[\d+\]/.test(key); // Check if the key represents an array index
                if (isArrayIndex) {
                    var arrayKey = key.substring(0, key.indexOf("["));
                    var i_1 = key.match(/\[(\d+)\]/);
                    if (!i_1)
                        throw new Error("Invalid array index");
                    var index = parseInt(i_1[0], 10);
                    if (!currentObj[arrayKey]) {
                        currentObj[arrayKey] = [];
                    }
                    if (!currentObj[arrayKey][index]) {
                        currentObj[arrayKey][index] = {};
                    }
                    currentObj = currentObj[arrayKey][index];
                }
                else {
                    if (!currentObj[key]) {
                        currentObj[key] = {};
                    }
                    currentObj = currentObj[key];
                }
            }
            currentObj[keys[keys.length - 1]] = value;
        };
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
    return PayloadModule;
}());
var ondc = {};
ondc.beckn = new PayloadModule("domain");
exports.default = ondc;
