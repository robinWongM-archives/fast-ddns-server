import { BadRequestException, Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { UploadRecordDto } from './dto/uploadRecord.dto';
import { NotifyGateway } from './notify.gateway';
import { Record } from './record.entity';

const ACCESS_TOKEN = 'YouWontKnowWhatTokenWillIUseUnlessYouGotMyCodeHoweverItsOpenSourceHuh';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly notifyGateway: NotifyGateway,
  ) {}

  logger = new Logger(AppController.name);

  @Get()
  getRecords(): Promise<Record[]> {
    return this.appService.getAllRecords();
  }

  @Get('/ddns')
  async uploadRecord(@Query() query: UploadRecordDto): Promise<Record> {
    if (!query.domain || !query.ip || query.token !== ACCESS_TOKEN) {
      throw new BadRequestException('Invalid query parameters');
    }
    const record = await this.appService.updateOneRecord(query.domain, query.ip);
    this.notifyGateway.sendUpdate(record);
    return record;
  }

  @Post('/ddns-openwrt')
  async uploadRecordFromRouter(@Query() query: UploadRecordDto, @Body() body: any) {
    if (!query.domain || query.token !== ACCESS_TOKEN || !body || !body['ipv6-address']) {
      this.logger.log('Received invalid')
      throw new BadRequestException('Invalid query parameters');
    }
    const ip = body?.['ipv6-address']?.[0]?.address;
    if (!ip) {
      throw new BadRequestException('Wrong ubus data');
    }
    const record = await this.appService.updateOneRecord(query.domain, ip);
    this.notifyGateway.sendUpdate(record);
    return record;
  }
}
