import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AccountResponseDto } from './dtos/get-accounts-response.dto';
import { AccountsService } from './accounts.service';
import { GetAccountByIdDto } from './dtos/get-account-by-id-response.dto';

@ApiTags('accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all accounts' })
  @ApiOkResponse({ type: AccountResponseDto, isArray: true })
  async getAll(): Promise<AccountResponseDto[]> {
    return this.accountsService.getAllAccounts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account balance by id' })
  @ApiOkResponse({ type: GetAccountByIdDto })
  @ApiNotFoundResponse({ description: 'Account not found' })
  async getBalanceById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GetAccountByIdDto> {
    return this.accountsService.getAccountBalanceById(id);
  }

}
