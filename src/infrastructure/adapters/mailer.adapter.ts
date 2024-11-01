import { Injectable } from '@nestjs/common';
import { EmailProps, IEmailPort } from 'src/domain/ports/email.port';
import { google } from 'googleapis';
import * as path from 'path';
import * as nodemailer from 'nodemailer';
import { create } from 'express-handlebars';

@Injectable()
export class MailerAdapter implements IEmailPort {
  private transporter: nodemailer.Transporter;
  private oauth2Client;
  constructor() {
    console.log('USER EMAIL', process.env.EMAIL_USER);
    this.oauth2Client = new google.auth.OAuth2(
      process.env.EMAIL_CLIENT_ID,
      process.env.EMAIL_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground',
    );
    this.oauth2Client.setCredentials({
      refresh_token: process.env.EMAIL_REFRESH_TOKEN,
    });
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN,
        accessToken: this.getAccessToken(),
      },
      tls: {
        rejectUnauthorized: false,
      },
    }) as nodemailer.TransportOptions;

    this.configureHandlebars();
  }

  private configureHandlebars() {
    const hbs = create({
      extname: '.hbs',
      layoutsDir: path.resolve(__dirname, '../../presentation/email/templates'),
      partialsDir: path.resolve(
        __dirname,
        '../../presentation/email/templates',
      ),
      defaultLayout: false,
      helpers: {
        eq: function (a: any, b: any) {
          return a === b;
        },
      },
    });

    this.transporter.use('compile', (mail, callback) => {
      if (mail.data && mail.data.template) {
        const templatePath = path.join(
          __dirname,
          '../../presentation/email/templates',
          `${mail.data.template}.hbs`,
        );
        hbs
          .render(templatePath, mail.data.context)
          .then((html) => {
            mail.data.html = html;
            callback();
          })
          .catch(callback);
      } else {
        callback();
      }
    });
  }

  private async getAccessToken(): Promise<string> {
    const { token } = await this.oauth2Client.getAccessToken();
    if (!token) throw new Error('Failed to get access token');
    return token;
  }

  async sendEmail(props: EmailProps): Promise<void> {
    try {
      await this.transporter.sendMail({
        to: props.to,
        subject: props.subject,
        template: props.template,
        context: props.context,
      });
    } catch (error) {
      console.log('Error sending email', error);
    }
  }
}
