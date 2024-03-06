import * as SibApiV3Sdk from "@getbrevo/brevo";
import { EmailConfig } from "./EmailConfig";
import { emailErrorMessage } from "../../@types";

export class EmailSender {
  protected apiInstance: SibApiV3Sdk.TransactionalEmailsApi;
  constructor(config: EmailConfig) {
    this.apiInstance = config.getApiTransporter();
  }
  // Method to Send the Email
  protected async sendEmail(
    option: SibApiV3Sdk.SendSmtpEmail
  ): Promise<emailErrorMessage | null> {
    try {
      await this.apiInstance.sendTransacEmail({
        ...option,
        sender: {
          name: "Krikia ltd",
          email: "krikiagloballtd@gmail.com",
        },
      });
      return null;
    } catch (error) {
      console.log(error);
      throw new Error("Error Occured Sending Email");
    }
  }
}
