import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/domain/entities/user.entity';
import { EmailTemplate, IEmailPort } from 'src/domain/ports/email.port';

@Injectable()
export class SendActivationEmailUsecase {
  constructor(
    @Inject('IEmailPort')
    private readonly emailPort: IEmailPort,
  ) {}

  async execute(user: User): Promise<void> {
    await this.emailPort.sendEmail({
      to: user.getEmail(),
      subject: 'Valider votre compte',
      template: EmailTemplate.ACTIVATION,
      context: {
        name: user.getName(),
        activationLink: `${process.env.WEB_URL}/auth/activate/${user.getId()}`,
        role: user.getRole(),
      },
    });
  }
}
