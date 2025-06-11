import pug from 'pug';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const brevo = require('@getbrevo/brevo');
const apiInstance = new brevo.TransactionalEmailsApi();
import env from '~/configs/environments';

const apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = env.BREVO_API_KEY;

const verifyAccount = async (email: string, verifyToken: string) => {
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = 'Verify your email';
  sendSmtpEmail.htmlContent = pug.renderFile(
    'C:\\Users\\ACER\\Workspace\\full-stack-project\\e-commerce\\e-commerce-api\\src\\templates\\verify-account.pug',
    {
      verifyToken
    }
  );
  sendSmtpEmail.sender = {
    name: env.EMAIL_NAME,
    email: env.EMAIL_ADDRESS
  };
  sendSmtpEmail.to = [{ email: email }];
  return apiInstance.sendTransacEmail(sendSmtpEmail);
};
const verifyShop = async (email: string) => {
  const sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = 'Verify your email';
  sendSmtpEmail.htmlContent = pug.renderFile(
    'C:\\Users\\ACER\\Workspace\\full-stack-project\\e-commerce\\e-commerce-api\\src\\templates\\verify-account.pug'
  );
  sendSmtpEmail.sender = {
    name: env.EMAIL_NAME,
    email: env.EMAIL_ADDRESS
  };
  sendSmtpEmail.to = [{ email: email }];
  return apiInstance.sendTransacEmail(sendSmtpEmail);
};
export const BrevoProvider = {
  verifyAccount,
  verifyShop
};
// C:\Users\ACER\Workspace\full-stack-project\e-commerce\e-commerce-api\src\providers
