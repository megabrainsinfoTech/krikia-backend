"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailConfig = void 0;
var SibApiV3Sdk = require("@getbrevo/brevo");
var EmailConfig = /** @class */ (function () {
    function EmailConfig(apiSecretKey) {
        this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        this.apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, apiSecretKey);
    }
    EmailConfig.prototype.getApiTransporter = function () {
        return this.apiInstance;
    };
    return EmailConfig;
}());
exports.EmailConfig = EmailConfig;
