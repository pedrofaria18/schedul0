import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class WorkSchedulesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findMany<T = Prisma.WorkScheduleFindManyArgs>(
    findManyDto: Prisma.SelectSubset<T, Prisma.WorkScheduleFindManyArgs>,
  ) {
    return this.prismaService.workSchedule.findMany<T>(findManyDto);
  }

  findFirst(findFirstDto: Prisma.WorkScheduleFindFirstArgs) {
    return this.prismaService.workSchedule.findFirst(findFirstDto);
  }

  create(createDto: Prisma.WorkScheduleCreateArgs) {
    return this.prismaService.workSchedule.create(createDto);
  }

  update(updateDto: Prisma.WorkScheduleUpdateArgs) {
    return this.prismaService.workSchedule.update(updateDto);
  }

  delete(deleteDto: Prisma.WorkScheduleDeleteArgs) {
    return this.prismaService.workSchedule.delete(deleteDto);
  }
}
