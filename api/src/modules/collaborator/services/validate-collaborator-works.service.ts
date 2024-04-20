import { Injectable, NotFoundException } from '@nestjs/common';
import { CollaboratorsRepository } from 'src/shared/database/repositories/collaborators.repositories';
import { ConvertDate } from 'src/shared/utils/convertDate';
import { getDayOfWeek } from 'src/shared/utils/getDayOfWeek';

@Injectable()
export class ValidateCollaboratorWorksService {
  constructor(
    private readonly collaboratorsRepo: CollaboratorsRepository,
    private readonly convertDate: ConvertDate,
  ) {}

  async validate(collaboratorId: string, dateTime: string, duration?: number) {
    const dayOfWeekOfAppointment = getDayOfWeek(dateTime);

    const collaborator: any = await this.collaboratorsRepo.findFirst({
      where: {
        id: collaboratorId,
        workSchedules: {
          some: {
            dayOfWeek: dayOfWeekOfAppointment,
          },
        },
      },
      include: {
        workSchedules: {
          where: {
            dayOfWeek: dayOfWeekOfAppointment,
          },
        },
      },
    });

    if (!collaborator) {
      throw new NotFoundException(
        `Collaborator selected dont work in ${dayOfWeekOfAppointment}`,
      );
    }

    if (duration) {
      const appointmentStartMinutes = this.convertDate.timeToMinutes(
        this.convertDate.formatTime(dateTime),
      );
      const appointmentEndMinutes = this.convertDate.timeToMinutes(
        this.convertDate.formatTime(dateTime, duration),
      );

      const {
        startTimeMorning,
        endTimeMorning,
        startTimeAfternoon,
        endTimeAfternoon,
      } = collaborator.workSchedules[0];

      const [
        collaboratorStartMorningMinutes,
        collaboratorEndMorningMinutes,
        collaboratorStartAfternoonMinutes,
        collaboratorEndAfternoonMinutes,
      ] = [
        this.convertDate.timeToMinutes(startTimeMorning),
        this.convertDate.timeToMinutes(endTimeMorning),
        this.convertDate.timeToMinutes(startTimeAfternoon),
        this.convertDate.timeToMinutes(endTimeAfternoon),
      ];

      const isMorningValid =
        appointmentStartMinutes >= collaboratorStartMorningMinutes &&
        appointmentEndMinutes <= collaboratorEndMorningMinutes;

      const isAfternoonValid =
        appointmentStartMinutes >= collaboratorStartAfternoonMinutes &&
        appointmentEndMinutes <= collaboratorEndAfternoonMinutes;

      if (!(isMorningValid || isAfternoonValid)) {
        throw new NotFoundException(
          `Collaborator does not work during these hours`,
        );
      }
    }
  }
}
