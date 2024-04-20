import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class ServicesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findMany<T = Prisma.ServiceFindManyArgs>(
    findManyDto: Prisma.SelectSubset<T, Prisma.ServiceFindManyArgs>,
  ) {
    return this.prismaService.service.findMany<T>(findManyDto);
  }

  findFirst(findFirstDto: Prisma.ServiceFindFirstArgs) {
    return this.prismaService.service.findFirst(findFirstDto);
  }

  create(createDto: Prisma.ServiceCreateArgs) {
    return this.prismaService.service.create(createDto);
  }

  update(updateDto: Prisma.ServiceUpdateArgs) {
    return this.prismaService.service.update(updateDto);
  }

  delete(deleteDto: Prisma.ServiceDeleteArgs) {
    return this.prismaService.service.delete(deleteDto);
  }
}
