import { MailerService } from '@nestjs-modules/mailer';
import { IUser } from '../users/interfaces/user.interface';
export declare class MailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendUserConfirmation(user: IUser, token: string): Promise<void>;
}
