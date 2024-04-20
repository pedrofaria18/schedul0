import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class ServiceTypesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findMany<T = Prisma.ServiceTypeFindManyArgs>(
    findManyDto: Prisma.SelectSubset<T, Prisma.ServiceTypeFindManyArgs>,
  ) {
    return this.prismaService.serviceType.findMany<T>(findManyDto);
  }

  findFirst(findFirstDto: Prisma.ServiceTypeFindFirstArgs) {
    return this.prismaService.serviceType.findFirst(findFirstDto);
  }

  create(createDto: Prisma.ServiceTypeCreateArgs) {
    return this.prismaService.serviceType.create(createDto);
  }

  update(updateDto: Prisma.ServiceTypeUpdateArgs) {
    return this.prismaService.serviceType.update(updateDto);
  }

  delete(deleteDto: Prisma.ServiceTypeDeleteArgs) {
    return this.prismaService.serviceType.delete(deleteDto);
  }
}
