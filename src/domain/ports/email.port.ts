export interface IEmailPort {
  sendEmail(email: EmailProps): Promise<void>;
}

export interface EmailProps {
  to: string;
  subject: string;
  template: EmailTemplate;
  context: Record<string, any>;
}

export enum EmailTemplate {
  ACTIVATION = 'activation',
}
