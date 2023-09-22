import { UserVerification } from '@modules/auth/verification.schema';
import { User } from '@modules/user/user.schema';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

import { createTransport, type Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transport: Transporter;

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {}

  public async onModuleInit() {
    const service = this.configService.get<string>('SMTP_SERVICE');
    const email = this.configService.get<string>('SMTP_EMAIL');
    const password = this.configService.get<string>('SMTP_PASSWORD');

    if (!email || !password) {
      this.logger.log(
        'SMTP_EMAIL or SMTP_PASSWORD not set, skipping email setup...',
      );
      return;
    }

    this.transport = createTransport({
      service: service || 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  public async sendVerificationCodeEmail(
    user: User,
    userVerification: UserVerification,
    hours = 1,
  ): Promise<{ error: string } | undefined> {
    if (!this.transport) {
      this.logger.error('SMTP not configured.');
      return;
    }

    const mail = {
      from: 'support@ateoat.com',
      replyTo: 'support@ateoat.com',
      to: user.email,
      subject: 'Your ateoat Verification Code',
      text: `Hello ${user.username}#${user.discriminator}, you requested to verify your email.

      Your email verification code is: ${userVerification.verificationCode}

      This code will be valid for ${hours} hour(s).

      If you did not request this, please reach out to support@ateoat.com.
      `,
    };

    try {
      await this.transport.sendMail(mail);
    } catch (e) {
      this.logger.error(e);
      return { error: e.message };
    }
  }

  public async sendTemporaryPasswordEmail(
    user: User,
  ): Promise<{ error: string } | undefined> {
    if (!this.transport) {
      this.logger.error(
        `The mail server is not configured. Temporary password for email ${user.email} set to "${user.temporaryPassword}" (if email exists).`,
      );
      return;
    }

    const mail = {
      from: 'support@ateoat.com',
      replyTo: 'support@ateoat.com',
      to: user.email,
      subject: 'Your ateoat Temporary Password',
      text: `Hello, you requested a temporary password.

      Your temporary password for "${user.username}#${user.discriminator}" is: ${user.temporaryPassword}

      Please note, this password will be automatically erased on your next login, and it did NOT replace your existing password.

      When you log in, reset your password immediately.

      If you did not request this, please reach out to support@ateoat.com.
      `,
    };

    try {
      await this.transport.sendMail(mail);
    } catch (e) {
      this.logger.error(e);
      return { error: e.message };
    }
  }
}
