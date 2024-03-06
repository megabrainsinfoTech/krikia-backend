import { EmailConfig, WelcomeNotificationSender } from '@krikia/email';
// In Cases Where you have multiple Key EmailConfig can be in the Modules, Before Exporting it
const config = new EmailConfig(process.env.EMAIL_API_KEY as string);
const WelcomeNotification = new WelcomeNotificationSender(config);
export { WelcomeNotification };
