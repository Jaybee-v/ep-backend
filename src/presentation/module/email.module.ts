import { Module } from '@nestjs/common';
import { SendActivationEmailUsecase } from 'src/application/email/send-activation-email.usecase';
import { MailerAdapter } from 'src/infrastructure/adapters/mailer.adapter';

@Module({
  providers: [
    SendActivationEmailUsecase,
    {
      provide: 'IEmailPort',
      useClass: MailerAdapter,
    },
  ],
  exports: [SendActivationEmailUsecase],
})
export class EmailModule {}
