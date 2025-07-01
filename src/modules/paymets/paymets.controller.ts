import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PaymetsService } from './paymets.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { PaymentsDto } from 'src/dtos/paymentDto';
@UseGuards(AdminGuard)
@Controller('paymets')
export class PaymetsController {
  constructor(private readonly paymetsService: PaymetsService) {}
  @Post('addPayment')
  async addPayment(@Body() paymentDto: PaymentsDto) {
    try {
      return await this.paymetsService.addPayment(paymentDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
