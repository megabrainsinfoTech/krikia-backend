
import * as nodemailer from "nodemailer"
import pug from "pug"
import path from "path"
import htmlToText from "html-to-text"
import dayjs from "dayjs"
import { prepareOptions } from "sequelize-typescript"
import SMTPTransport from "nodemailer/lib/smtp-transport"

require("dayjs/locale/en");

export default class Email {
  
  to: string;
  firstName:string;
  url: string;
  from: string;
  data: object;
  
  /**
   *
   * @param {Object} user - This is the user request object that contains the username
   * @param {string} from - This is the Krikia Email Address, you are sending the mail from.
   * @param {URL} url - This is the call to action Url to be included in the template
   * @param {Object} extraData - This contains all extra data
   * @example Email({firstName: "John", lastName: "Doe", email:"johndoe@krikia.com"}, "admin@krikia.com", "https://krikia.com/buy")
   *    */

  constructor(user: any, from: string, url: string, extraData: object) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = from;
    this.data = extraData;
  }
  /**
   * Setup Email Configuration
   *
   */
  newTransport() {
    // if (process.env.NODE_ENV === "development") {
    //   return 0;
    // }

    /**
     * Email Auth Username
     */
    const emailAuthUser =
      this.from === process.env.EMAIL_USERNAME
        ? process.env.EMAIL_USERNAME
        : this.from === process.env.SECURITY_CHECK_EMAIL_USERNAME
        ? process.env.SECURITY_CHECK_EMAIL_USERNAME
        : this.from === process.env.INSPECTION_EMAIL_USER
        ? process.env.INSPECTION_EMAIL_USER
        : this.from === process.env.NOTIFICATION_EMAIL_USER
        ? process.env.NOTIFICATION_EMAIL_USER
        : true;
    /**
     * Email Auth Password
     */
    const emailAuthPass =
      this.from === process.env.EMAIL_USERNAME
        ? process.env.EMAIL_PASSWORD
        : this.from === process.env.SECURITY_CHECK_EMAIL_USERNAME
        ? process.env.SECURITY_CHECK_EMAIL_PASSWORD
        : this.from === process.env.INSPECTION_EMAIL_USER
        ? process.env.INSPECTION_EMAIL_PASSWORD
        : this.from === process.env.NOTIFICATION_EMAIL_USER
        ? process.env.NOTIFICATION_PASSWORD_USER
        : true;

    // const options: SMTPTransport = {
    //   service: "gmail",
    //   host: process.env.EMAIL_HOST || "localhost",
    //   port: process.env.EMAIL_PORT || 465,
    //   secure: true, // true for 465, false for other ports
    //   auth: {
    //     user: emailAuthUser as string,
    //     pass: emailAuthPass,
    //   }
    // }
      
    return nodemailer.createTransport();
  }

  /**
   * This method sends out mail
   * @param {string} template Name
   * @param {string} subject
   *
   */
  async send(templateName: string, subject: any) {
    // Send Actual Email
    // 1) Render HTML based on a pug template
    const compiledFunction = pug.compileFile(
      path.join(`${__dirname}/../views/emails/${templateName}.pug`)
    );

    const html = compiledFunction({
      firstName: this.firstName,
      data: this.data,
      email: this.to,
      url: this.url,
      subject,
      dateCreated: dayjs().format("dddd, MMMM DD YYYY hh:mm:ss A"),
    });

    // 2) Define email options
    const mailOption = {
      from: `Krikia <${this.from}>`,
      to: this.to,
      subject,
      html,
      text: htmlToText.htmlToText(html),
    };

    // 3) Create a transport and send email
    const transporter = this.newTransport();
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });

    return await transporter.sendMail(mailOption);
  }

  async sendWelcome() {
    this.send("welcome", "Welcome to Krikia");
  }
  async sendVerifyEmail() {
    this.send("confirmEmail", "Confirm your Email Address!");
  }
  async sendSecurityCheck() {
    return await this.send("securityCheck", "Security Check");
  }
  async sendInspection() {}
};
