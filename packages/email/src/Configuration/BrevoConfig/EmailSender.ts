import * as SibApiV3Sdk from "@getbrevo/brevo";
import { EmailConfig } from "./EmailConfig";
import { emailErrorMessage } from "../../@types";

export class EmailSender {
  protected apiInstance: SibApiV3Sdk.TransactionalEmailsApi;
  constructor(config: EmailConfig) {
    // Check if the Enviromental Variable Are Configured Correctly
    if (!process.env.SENDER_EMAIL_NAME || !process.env.SENDER_EMAIL_EMAIL) {
      throw new Error(
        "Please setup the env variables for SENDER_EMAIL_NAME and process.env.SENDER_EMAIL_EMAIL"
      );
    }

    this.apiInstance = config.getApiTransporter();
  }
  // Method to Send the Email
  protected async sendEmail(
    option: SibApiV3Sdk.SendSmtpEmail
  ): Promise<emailErrorMessage | null> {
    try {
      const response = await this.apiInstance.sendTransacEmail({
        ...option,
        sender: {
          name: process.env.SENDER_EMAIL_NAME || undefined,
          email: process.env.SENDER_EMAIL_EMAIL || undefined,
        },
      });
      // console.log("Email Sent Successfully");
      return null;
    } catch (error) {
      console.log(error);
      throw new Error("Error Occured Sending Email");
    }
  }
}
