import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { RegisterNewUserDto } from '../auth/dto/register-new-user.dto';

@Processor('sendMail-queue')
export class SendMailConsumer {
    constructor(private mailService: MailerService) {}

    @Process('sendMail-job')
    async sendMailJob(job: Job<RegisterNewUserDto>) {
        const { data } = job;
        await this.mailService.sendMail({
            to: data.email,
            from: 'Moraes Tech <moraestech@gmail.com>',
            template: './confirmation', // `.hbs` extension is appended automatically
            subject: 'Qatar 2022',
            context: { // ✏️ filling curly brackets with content
                name: data.name
            },
        });
    }
}