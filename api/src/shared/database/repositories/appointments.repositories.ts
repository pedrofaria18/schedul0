import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class AppointmentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findMany<T = Prisma.AppointmentFindManyArgs>(
    findManyDto: Prisma.SelectSubset<T, Prisma.AppointmentFindManyArgs>,
  ) {
    return this.prismaService.appointment.findMany<T>(findManyDto);
  }

  findFirst(findFirstDto: Prisma.AppointmentFindFirstArgs) {
    return this.prismaService.appointment.findFirst(findFirstDto);
  }

  create(createDto: Prisma.AppointmentCreateArgs) {
    return this.prismaService.appointment.create(createDto);
  }

  update(updateDto: Prisma.AppointmentUpdateArgs) {
    return this.prismaService.appointment.update(updateDto);
  }

  delete(deleteDto: Prisma.AppointmentDeleteArgs) {
    return this.prismaService.appointment.delete(deleteDto);
  }
}
