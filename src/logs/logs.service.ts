import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from './schemas/log.schema';

@Injectable()
export class LogsService {
  constructor(
    @InjectModel(Log.name) private readonly model: Model<LogDocument>,
  ) {}

  create(data: Partial<Log>) {
    return this.model.create(data);
  }

  findAll() {
    return this.model.find().exec();
  }
}
