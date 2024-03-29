import * as SibApiV3Sdk from "@getbrevo/brevo";
import { EmailSender } from "../Configuration/BrevoConfig";
import { emailErrorMessage, singleMail } from "../@types";

export class WelcomeNotificationSender extends EmailSender {
  /**
   * Sends Mail to Single Customer Whom Recently Joined Krikia
   */
  public async sendWelcomeToKrikiaCustomer(
    option: singleMail
  ): Promise<emailErrorMessage | null> {
    // TemplateId For sendWelcomeToKrikiaCustomer
    return await this.sendEmail({ ...option, to: [option.to], templateId: 1 });
  }

  public async sendWelcomeToKrikiaBusiness(
    option: SibApiV3Sdk.SendSmtpEmail
  ): Promise<emailErrorMessage | null> {
    return await this.sendEmail({});
  }
}
