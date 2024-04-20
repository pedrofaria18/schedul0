import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ClientsService } from './services/clients.service';
import { ActiveUserId } from 'src/shared/decorators/activeUserId';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get(':companyId')
  findAllByCompanyId(
    @ActiveUserId() userId: string,
    @Param('companyId', ParseUUIDPipe) companyId: string,
  ) {
    return this.clientsService.findAllByCompanyId(userId, companyId);
  }

  @Get(':clientId')
  findOne(@ActiveUserId() userId: string, @Param('clientId') clientId: string) {
    return this.clientsService.findOne(userId, clientId);
  }
}
