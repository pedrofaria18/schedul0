import { Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentsRepository } from 'src/shared/database/repositories/appointments.repositories';

@Injectable()
export class ValidateAppointmentOwnershipService {
  constructor(private readonly appointmentsRepo: AppointmentsRepository) {}

  async validate(userId: string, appointmentId: string) {
    const isOwner = await this.appointmentsRepo.findFirst({
      where: {
        id: appointmentId,
        company: {
          userId,
        },
      },
    });

    if (!isOwner) {
      throw new NotFoundException('Appointment not found.');
    }
  }
}
