import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
    private readonly logger = new Logger(CronService.name);
    // @Cron('*/10 * * * * *')
    // runEvery10Seconds() {
    //     this.logger.debug('Called when the current second is 10');
    //     console.log('Called when the current second is 10');
    // }
}
