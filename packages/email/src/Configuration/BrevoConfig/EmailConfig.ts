import * as SibApiV3Sdk from "@getbrevo/brevo";
export class EmailConfig {
  private apiInstance: SibApiV3Sdk.TransactionalEmailsApi;
  constructor(apiSecretKey: string) {
    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    this.apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      apiSecretKey
    );
  }
  getApiTransporter(): SibApiV3Sdk.TransactionalEmailsApi {
    return this.apiInstance;
  }
}
