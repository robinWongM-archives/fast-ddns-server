import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from './record.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  async getAllRecords(): Promise<Record[]> {
    return await this.recordRepository.find();
  }

  async updateOneRecord(domain: string, ip: string): Promise<Record> {
    let record = await this.recordRepository.findOne({
      domain,
    });
    if (record) {
      record.value = ip;
    } else {
      record = new Record();
      record.domain = domain;
      record.value = ip;
    }
    return await this.recordRepository.save(record);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
