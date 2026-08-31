import { Module } from '@nestjs/common';
import { CommissionProfitController } from './commission-profit.controller';
import { CommissionProfitService } from './commission-profit.service';

@Module({
  controllers: [CommissionProfitController],
  providers: [CommissionProfitService],
  exports: [CommissionProfitService],
})
export class CommissionProfitModule {}
