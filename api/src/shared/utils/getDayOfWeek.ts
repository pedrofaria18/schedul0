import { WorkScheduleDays } from 'src/modules/collaborator/entities/WorkSchedules';

export function getDayOfWeek(dateTime: string): WorkScheduleDays {
  const dateObj = new Date(dateTime);
  const dayIndex = dateObj.getDay();
  switch (dayIndex) {
    case 0:
      return WorkScheduleDays.SUNDAY;
    case 1:
      return WorkScheduleDays.MONDAY;
    case 2:
      return WorkScheduleDays.TUESDAY;
    case 3:
      return WorkScheduleDays.WEDNESDAY;
    case 4:
      return WorkScheduleDays.THURSDAY;
    case 5:
      return WorkScheduleDays.FRIDAY;
    case 6:
      return WorkScheduleDays.SATURDAY;
    default:
      throw new Error('Dia da semana inválido');
  }
}
