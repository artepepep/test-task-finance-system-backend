import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import type { Request } from 'express';

import { ExchangeBodyDto } from './dtos/exchange-body.dto';
import { TransactionResponseDto } from './dtos/transaction-response.dto';
import { TransactionsPaginatedQuery } from './dtos/transactions-paginated-query.dto';
import { TransferBodyDto } from './dtos/transfer-body.dto';
import { TransferResponseDto } from './dtos/transfer-response.dto';
import { TransactionType } from './enums/transaction-type.enum';
import { TransactionService } from './transaction.service';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('transfer')
  @ApiOperation({ summary: 'Transfer between accounts' })
  @ApiBody({ type: TransferBodyDto })
  @ApiOkResponse({ type: TransferResponseDto })
  async transfer(@Body() transferDto: TransferBodyDto) {
    const result = await this.transactionService.transfer(transferDto);

    return result;
  }

  @Post('exchange')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Exchange between user accounts' })
  @ApiBody({ type: ExchangeBodyDto })
  @ApiOkResponse({ type: TransferResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async exchange(@Body() exchangeDto: ExchangeBodyDto, @Req() req: Request) {
    // @ts-expect-error
    if (!req.user || !req.user.userId) {
      throw new BadRequestException(
        'You must be authorized to create exchange transaction',
      );
    }
    const result = await this.transactionService.exchange(
      exchangeDto,
      // @ts-expect-error
      req.user.userId,
    );

    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated transactions' })
  @ApiOkResponse({ type: TransactionResponseDto, isArray: true })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: true, enum: TransactionType })
  async getPaginated(@Query() data: TransactionsPaginatedQuery) {
    const result = await this.transactionService.getPaginated(data);

    return result;
  }
}
