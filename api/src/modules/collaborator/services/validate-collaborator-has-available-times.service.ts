import { Injectable, NotFoundException } from '@nestjs/common';
import { CollaboratorsRepository } from 'src/shared/database/repositories/collaborators.repositories';
import { getDayOfWeek } from 'src/shared/utils/getDayOfWeek';
import { ConvertDate } from 'src/shared/utils/convertDate';
import { WorkScheduleDto } from '../dto/create-collaborator.dto';
import { AppointmentStatus } from 'src/modules/appointments/entities/AppointmentStatus';

interface UnavailableTime {
  start: string;
  end: string;
}

@Injectable()
export class ValidateCollaboratorHasAvailableTimesService {
  constructor(
    private readonly collaboratorsRepo: CollaboratorsRepository,
    private readonly convertDate: ConvertDate,
  ) {}

  async validate(
    needValidate: boolean = true,
    collaboratorId: string,
    timestamp: string,
  ) {
    const dayOfWeekOfAppointment = getDayOfWeek(timestamp);

    const startDate = new Date(timestamp);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(timestamp);
    endDate.setHours(23, 59, 59, 999);

    const collaborator: any = await this.collaboratorsRepo.findFirst({
      where: {
        id: collaboratorId,
      },
      include: {
        workSchedules: {
          where: {
            dayOfWeek: dayOfWeekOfAppointment,
          },
        },
        services: {
          where: {
            collaboratorId,
            dateTime: {
              gte: startDate.toISOString(),
              lte: endDate.toISOString(),
            },
          },
          include: {
            serviceType: {
              select: {
                duration: true,
              },
            },
            appointment: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

    const unavailableTimes = collaborator.services
      .filter(
        (service) => service.appointment.status === AppointmentStatus.SCHEDULED,
      )
      .map((service) => {
        const durationFormated =
          Math.ceil(service.serviceType.duration / 30) * 30;
        return {
          start: `${this.convertDate.formatTime(service.dateTime)}`,
          end: `${this.convertDate.formatTime(service.dateTime, durationFormated)}`,
        };
      });

    const hoursAvailable = await this.calculateAvailableTimes(
      needValidate,
      timestamp,
      collaborator.workSchedules[0],
      unavailableTimes,
    );

    const appointmentHour = this.convertDate.formatTime(timestamp);

    if (needValidate && !hoursAvailable.includes(appointmentHour)) {
      throw new NotFoundException(
        `One or more requested times are not available`,
      );
    }

    return hoursAvailable;
  }

  private async calculateAvailableTimes(
    needValidate: boolean,
    timestamp: string,
    workSchedule: WorkScheduleDto,
    unavailableTimes?: UnavailableTime[],
  ) {
    const schedule = this.generateSchedule(workSchedule);
    const availableSchedule = this.removeUnavailableTimes(
      needValidate,
      timestamp,
      schedule,
      unavailableTimes,
    );

    return availableSchedule;
  }

  private generateSchedule(workSchedule: WorkScheduleDto) {
    const generateInterval = (start: number, end: number): string[] => {
      const schedule: string[] = [];
      for (let i = start; i < end; i += 30) {
        schedule.push(
          `${Math.floor(i / 60)
            .toString()
            .padStart(2, '0')}:${(i % 60).toString().padStart(2, '0')}`,
        );
      }
      return schedule;
    };

    const startMorning = this.convertDate.timeToMinutes(
      workSchedule.startTimeMorning,
    );
    const endMorning = this.convertDate.timeToMinutes(
      workSchedule.endTimeMorning,
    );
    const startAfternoon = this.convertDate.timeToMinutes(
      workSchedule.startTimeAfternoon,
    );
    const endAfternoon = this.convertDate.timeToMinutes(
      workSchedule.endTimeAfternoon,
    );

    const morningSchedule = generateInterval(startMorning, endMorning);
    const afternoonSchedule = generateInterval(startAfternoon, endAfternoon);

    return [...morningSchedule, ...afternoonSchedule];
  }

  private removeUnavailableTimes(
    needValidate: boolean,
    timestamp: string,
    schedule: string[],
    unavailableTimes?: UnavailableTime[],
  ): string[] {
    const actualDate = new Date(timestamp);
    const actualTime = `${actualDate.toISOString().split('T')[1].split(':')[0]}:${actualDate.toISOString().split('T')[1].split(':')[1]}`;

    let times = schedule;

    if (!unavailableTimes) {
      return;
    }

    const minutesUnavailable = unavailableTimes.flatMap(({ start, end }) => {
      const startTime = this.convertDate.timeToMinutes(start);
      const endTime = this.convertDate.timeToMinutes(end);
      return Array.from(
        { length: endTime - startTime },
        (_, i) => startTime + i,
      );
    });

    times = times.filter((time) => {
      const minutes = this.convertDate.timeToMinutes(time);
      return !minutesUnavailable.includes(minutes);
    });

    if (!needValidate) {
      times = times.filter((time) => {
        const minutes = this.convertDate.timeToMinutes(time);
        return minutes > this.convertDate.timeToMinutes(actualTime);
      });
      return times;
    }

    times = times.filter((time) => {
      const minutes = this.convertDate.timeToMinutes(time);
      return minutes >= this.convertDate.timeToMinutes(actualTime);
    });

    return times;
  }
}
