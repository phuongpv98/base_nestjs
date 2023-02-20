import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { RegisterNewUserDto } from '@src/modules/system/auth/dto/register-new-user.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
@Injectable()
export class MailService {
  constructor(
    @InjectQueue('sendMail-queue') private emailQueue: Queue,
  ) {}

  async sendUserConfirmation(user: RegisterNewUserDto, token: string) {
    const url = `example.com/auth/confirm?token=${token}`;
    await this.emailQueue.add('sendMail-job', RegisterNewUserDto);
  }
}
