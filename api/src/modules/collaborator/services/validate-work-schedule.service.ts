import { Injectable, NotAcceptableException } from '@nestjs/common';
import { WorkScheduleDto } from '../dto/create-collaborator.dto';

@Injectable()
export class ValidateWorkScheduleService {
  validate(workSchedules: WorkScheduleDto[]) {
    const daysOfWeek: string[] = [];
    let hasDuplicateDayOfWeek = false;
    workSchedules.forEach((workSchedule) => {
      if (daysOfWeek.includes(workSchedule.dayOfWeek)) {
        hasDuplicateDayOfWeek = true;
      } else {
        daysOfWeek.push(workSchedule.dayOfWeek);
      }
    });

    if (hasDuplicateDayOfWeek) {
      throw new NotAcceptableException(
        'It is not allowed to have a duplicate weekday',
      );
    }

    let hasWrongTimeFormat = false;
    workSchedules.forEach((workSchedule) => {
      if (
        !this.validateTimeFormat(workSchedule.startTimeMorning) ||
        !this.validateTimeFormat(workSchedule.endTimeMorning) ||
        !this.validateTimeFormat(workSchedule.startTimeAfternoon) ||
        !this.validateTimeFormat(workSchedule.endTimeAfternoon)
      ) {
        hasWrongTimeFormat = true;
      }
    });

    if (hasWrongTimeFormat) {
      throw new NotAcceptableException(
        'One or more work schedule time is wrong format',
      );
    }

    let hasWrongTimeLogic = false;
    workSchedules.forEach((workSchedule) => {
      if (
        !this.validateTimeGreater(
          workSchedule.endTimeMorning,
          workSchedule.startTimeMorning,
        )
      ) {
        hasWrongTimeLogic = true;
      }

      if (
        !this.validateTimeGreater(
          workSchedule.endTimeAfternoon,
          workSchedule.startTimeAfternoon,
        )
      ) {
        hasWrongTimeLogic = true;
      }

      if (
        !this.validateTimeGreater(
          workSchedule.startTimeAfternoon,
          workSchedule.endTimeMorning,
        )
      ) {
        hasWrongTimeLogic = true;
      }
    });

    if (hasWrongTimeLogic) {
      throw new NotAcceptableException('The work schedule time is wrong');
    }
  }

  private validateTimeFormat(time: string) {
    const timeParts = time.split(':');

    if (timeParts.length !== 2) return false;

    if (timeParts[0].length !== 2 || timeParts[1].length !== 2) return false;

    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);

    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
  }

  validateTimeGreater(time1: string, time2: string) {
    const timeParts1 = time1.split(':');
    const timeParts2 = time2.split(':');

    const hours1 = parseInt(timeParts1[0]);
    const minutes1 = parseInt(timeParts1[1]);
    const hours2 = parseInt(timeParts2[0]);
    const minutes2 = parseInt(timeParts2[1]);

    if (hours1 > hours2) {
      return true;
    } else if (hours1 === hours2) {
      return minutes1 > minutes2;
    } else {
      return false;
    }
  }
}
