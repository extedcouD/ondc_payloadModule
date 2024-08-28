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
var uuid_1 = require("uuid");
var fis12 = /** @class */ (function () {
    function fis12() {
        var _this = this;
        this.contextValidation = function (session, context) {
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
            var SERVER_TYPE = process.env.SERVER_TYPE;
            var SUBSCRIBER_ID = process.env.SUBSCRIBER_ID;
            var SUBSCRIBER_URL = process.env.SUBSCRIBER_URL;
            var action = context.action;
            var errors = [];
            try {
                Object.entries(context).forEach(function (item) {
                    var _a, _b;
                    console.log("item", item);
                    var key = item[0], value = item[1];
                    switch (key) {
                        case "bap_id":
                            if ((action !== "search" || action !== "on_search") &&
                                ((SERVER_TYPE === "BAP" && value !== SUBSCRIBER_ID) ||
                                    (SERVER_TYPE === "BPP" && value !== session.bap_id))) {
                                errors.push("bap_id should be equal to ".concat(SERVER_TYPE === "BAP" ? SUBSCRIBER_ID : session.bap_id));
                            }
                            return;
                        case "bap_uri":
                            if ((action !== "search" || action !== "on_search") &&
                                ((SERVER_TYPE === "BAP" && value !== SUBSCRIBER_URL) ||
                                    (SERVER_TYPE === "BPP" && value !== session.bap_uri))) {
                                errors.push("bap_uri should be equal to ".concat(SERVER_TYPE === "BAP" ? SUBSCRIBER_URL : session.bap_uri));
                            }
                            return;
                        case "bpp_id":
                            if ((action !== "search" || action !== "on_search") &&
                                ((SERVER_TYPE === "BPP" && value !== SUBSCRIBER_ID) ||
                                    (SERVER_TYPE === "BAP" && value !== session.bpp_id))) {
                                errors.push("bpp_id should be equal to ".concat(SERVER_TYPE === "BPP" ? SUBSCRIBER_ID : session.bap_id));
                            }
                            return;
                        case "bpp_uri":
                            if ((action !== "search" || action !== "on_search") &&
                                ((SERVER_TYPE === "BPP" && value !== SUBSCRIBER_URL) ||
                                    (SERVER_TYPE === "BAP" && value !== session.bpp_uri))) {
                                errors.push("bpp_uri should be equal to ".concat(SERVER_TYPE === "BPP" ? SUBSCRIBER_URL : session.bap_uri));
                            }
                            return;
                        case "location":
                            if (!((_a = value === null || value === void 0 ? void 0 : value.country) === null || _a === void 0 ? void 0 : _a.code) ||
                                value.country.code !== session.country) {
                                errors.push("location.country.code should be equal to ".concat(session.country));
                            }
                            if (!((_b = value === null || value === void 0 ? void 0 : value.city) === null || _b === void 0 ? void 0 : _b.code) || value.city.code !== session.cityCode) {
                                errors.push("location.city.code should be equal to ".concat(session.country));
                            }
                            return;
                        case "transaction_id":
                            return;
                        case "message_id":
                            if (session.allMessageIds.includes(value)) {
                                errors.push("".concat(value, " already used as a message_id in previous transaction."));
                            }
                            session.allMessageIds.push(value);
                            return;
                        case "timestamp":
                            if ((session === null || session === void 0 ? void 0 : session.lastTimestamp) &&
                                new Date(value) < new Date(session.lastTimestamp)) {
                                errors.push("timestamp should be greater then last call. current call: ".concat(value, ", last call: ").concat(session.lastTimestamp));
                            }
                            session.lastTimestamp = value;
                            return;
                        case "domain":
                            if (value !== session.domain) {
                                errors.push("doamin should be equal to ".concat(session.domain));
                            }
                            return;
                        case "version":
                            if (value !== session.version) {
                                errors.push("doamin should be equal to ".concat(session.version));
                            }
                            return;
                        case "ttl":
                            if (value !== session.ttl) {
                                errors.push("doamin should be equal to ".concat(session.ttl));
                            }
                            return;
                        case "action":
                            return;
                        default:
                            errors.push("Additional field found in context: ".concat(key));
                    }
                });
                console.log("Errors: ", errors);
            }
            catch (e) {
                console.log("error", e);
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
        this.buildContext = function (_a) {
            var bap_id = _a.bap_id, bap_uri = _a.bap_uri, bpp_id = _a.bpp_id, bpp_uri = _a.bpp_uri, ttl = _a.ttl, version = _a.version, domain = _a.domain, transaction_id = _a.transaction_id, countryCode = _a.countryCode, cityCode = _a.cityCode, action = _a.action;
            var context = {};
            if (bap_id)
                context.bap_id = bap_id;
            if (bap_uri)
                context.bap_uri = bap_uri;
            if (bpp_id)
                context.bpp_id = bpp_id;
            if (bpp_uri)
                context.bpp_uri = bpp_uri;
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
                context.location = __assign(__assign({}, context.location), { city: {
                        code: cityCode,
                    } });
            context.message_id = (0, uuid_1.v4)();
            context.timestamp = new Date().toISOString();
            context.action = action;
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
        this.buildXinput = function (_a) {
            var formName = _a.formName, formheading = _a.formheading, formId = _a.formId, formUrl = _a.formUrl, formType = _a.formType, isResubmit = _a.isResubmit, isMultipleSubmission = _a.isMultipleSubmission;
            var xinput = {
                form: {
                    id: formId,
                },
            };
            if (formName && formheading) {
                var head = {};
                head.descriptor = {};
                head.descriptor.name = formName;
                head.headings = formheading;
                xinput.head = head;
            }
            return xinput;
        };
        this.buildIntent = function (_a) {
            var name = _a.name;
            return {
                category: {
                    descriptor: _this.buildDescriptor({ name: name }),
                },
            };
            1;
        };
        this.buildCategories = function (_a) {
            var id = _a.id, name = _a.name, code = _a.code;
            var categories = [];
            for (var i = 0; i < id.length; i++) {
                var category = {
                    id: id[0],
                };
                if (name && name[i] && code && code[i]) {
                    category.descriptor = _this.buildDescriptor({
                        name: name[i],
                        code: code[i],
                    });
                }
                categories.push(category);
            }
            return categories;
        };
        this.buildDescriptor = function (_a) {
            var name = _a.name, code = _a.code, short_desc = _a.short_desc, long_desc = _a.long_desc, imageData = _a.imageData;
            return __assign(__assign(__assign(__assign({}, (name && { name: name })), (code && { code: code })), (short_desc && long_desc && { short_desc: short_desc, long_desc: long_desc })), (imageData && { image: imageData }));
        };
        this.buildProvider = function (_a) {
            var id = _a.id, categories = _a.categories, tags = _a.tags;
            return __assign(__assign({ id: id }, (categories && {
                categories: _this.buildCategories(__assign({}, categories)),
            })), (tags && { tags: _this.buildTags(tags) }));
        };
        this.buildItem = function (_a) {
            var id = _a.id, name = _a.name, code = _a.code, categoryIDs = _a.categoryIDs, tags = _a.tags, isMatched = _a.isMatched, isRecommended = _a.isRecommended, xinput = _a.xinput;
            return __assign(__assign(__assign(__assign(__assign(__assign({ id: id }, (name &&
                code && {
                descriptor: _this.buildDescriptor({ name: name, code: code }),
            })), (categoryIDs && { category_ids: categoryIDs })), (tags && { tags: _this.buildTags(tags) })), (isMatched && { matched: isMatched })), (isRecommended && { recommended: isRecommended })), (xinput && { xinput: _this.buildXinput(__assign({}, xinput)) }));
        };
        this.buildPayment = function (_a) {
            var collectedBy = _a.collectedBy, tags = _a.tags, params = _a.params, type = _a.type, status = _a.status, id = _a.id;
            return __assign(__assign(__assign(__assign({ collected_by: collectedBy, tags: _this.buildTags(tags) }, (id && { id: id })), (status && { status: status })), (type && { type: type })), (params && { params: _this.buildPaymentParams(__assign({}, params)) }));
        };
        this.buildPaymentParams = function (_a) {
            var bankCode = _a.bankCode, accountNumber = _a.accountNumber, virtualPaymentAddress = _a.virtualPaymentAddress;
            return {
                bank_code: bankCode,
                bank_account_number: accountNumber,
                virtual_payment_address: virtualPaymentAddress,
            };
        };
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
    return fis12;
}());
var ondcFIS12 = new fis12();
var ondc = {
    beckn: {
        FIS12: ondcFIS12,
    },
};
exports.default = ondc;
