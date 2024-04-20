import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  Query,
  ParseArrayPipe,
} from '@nestjs/common';
import { CollaboratorsService } from './services/collaborators.service';
import { CreateCollaboratorDto } from './dto/create-collaborator.dto';
import { UpdateCollaboratorDto } from './dto/update-collaborator.dto';
import { ActiveUserId } from 'src/shared/decorators/activeUserId';

@Controller('collaborators')
export class CollaboratorsController {
  constructor(private readonly collaboratorService: CollaboratorsService) {}

  @Get('company/:companyId')
  findAllByCompanyId(
    @ActiveUserId() userId: string,
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Query('serviceIds', ParseArrayPipe) serviceIds?: string[],
  ) {
    return this.collaboratorService.findAllByCompanyId(
      userId,
      companyId,
      serviceIds,
    );
  }

  @Get('available-times/:collaboratorId')
  getCollaboratorFreeTime(
    @ActiveUserId() userId: string,
    @Param('collaboratorId', ParseUUIDPipe) collaboratorId: string,
    @Query('date') date: string,
    @Query('serviceTypeId', ParseUUIDPipe) serviceTypeId: string,
  ) {
    return this.collaboratorService.findAllAvailableTimesByCollaboratorId(
      userId,
      collaboratorId,
      date,
      serviceTypeId,
    );
  }

  @Get(':collaboratorId')
  findOne(
    @ActiveUserId() userId: string,
    @Param('collaboratorId', ParseUUIDPipe) collaboratorId: string,
  ) {
    return this.collaboratorService.findOneByCollaboratorId(
      userId,
      collaboratorId,
    );
  }

  @Post()
  create(
    @ActiveUserId() userId: string,
    @Body() createCollaboratorDto: CreateCollaboratorDto,
  ) {
    return this.collaboratorService.create(userId, createCollaboratorDto);
  }

  @Put(':collaboratorId')
  update(
    @ActiveUserId() userId: string,
    @Param('collaboratorId', ParseUUIDPipe) collaboratorId: string,
    @Body() updateCollaboratorDto: UpdateCollaboratorDto,
  ) {
    return this.collaboratorService.update(
      userId,
      collaboratorId,
      updateCollaboratorDto,
    );
  }

  @Delete(':collaboratorId')
  remove(
    @ActiveUserId() userId: string,
    @Param('collaboratorId', ParseUUIDPipe) collaboratorId: string,
  ) {
    return this.collaboratorService.remove(userId, collaboratorId);
  }
}
