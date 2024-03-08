export interface emailErrorMessage {
  message: string;
}
interface Ito {
  email: string;
  name: string;
}
interface IParams {
  subject: string;
  verifyUrl: string;
}
export interface singleMail {
  params: IParams;
  to: Ito;
}
