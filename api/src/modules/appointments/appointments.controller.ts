import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { AppointmentsService } from './services/appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ActiveUserId } from 'src/shared/decorators/activeUserId';
import { AppointmentStatus } from './entities/AppointmentStatus';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('company/:companyId')
  findAllByCompanyId(
    @ActiveUserId() userId: string,
    @Param('companyId', ParseUUIDPipe) companyId: string,
  ) {
    return this.appointmentsService.findAllByCompanyId(userId, companyId);
  }

  @Get('collaborator/:collaboratorId')
  findAllByCollaboratorId(
    @ActiveUserId() userId: string,
    @Param('collaboratorId', ParseUUIDPipe) collaboratorId: string,
  ) {
    return this.appointmentsService.findAllByCollaboratorId(
      userId,
      collaboratorId,
    );
  }

  @Get(':appointmentId')
  findOne(
    @ActiveUserId() userId: string,
    @Param('appointmentId', ParseUUIDPipe) appointmentId: string,
  ) {
    return this.appointmentsService.findOne(userId, appointmentId);
  }

  @Post()
  create(
    @ActiveUserId() userId: string,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    return this.appointmentsService.create(userId, createAppointmentDto);
  }

  @Put(':appointmentId')
  update(
    @ActiveUserId() userId: string,
    @Param('appointmentId', ParseUUIDPipe) appointmentId: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(
      userId,
      appointmentId,
      updateAppointmentDto,
    );
  }

  @Patch('/update-status/:appointmentId')
  updateStatus(
    @ActiveUserId() userId: string,
    @Param('appointmentId', ParseUUIDPipe) appointmentId: string,
    @Body('status') newStatus: AppointmentStatus,
  ) {
    return this.appointmentsService.updateStatus(
      userId,
      appointmentId,
      newStatus,
    );
  }

  @Delete(':appointmentId')
  remove(
    @ActiveUserId() userId: string,
    @Param('appointmentId', ParseUUIDPipe) appointmentId: string,
  ) {
    return this.appointmentsService.remove(userId, appointmentId);
  }
}
