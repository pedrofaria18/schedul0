import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class ClientsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findMany<T = Prisma.ClientFindManyArgs>(
    findManyDto: Prisma.SelectSubset<T, Prisma.ClientFindManyArgs>,
  ) {
    return this.prismaService.client.findMany<T>(findManyDto);
  }

  findFirst(findFirstDto: Prisma.ClientFindFirstArgs) {
    return this.prismaService.client.findFirst(findFirstDto);
  }

  create(createDto: Prisma.ClientCreateArgs) {
    return this.prismaService.client.create(createDto);
  }

  update(updateDto: Prisma.ClientUpdateArgs) {
    return this.prismaService.client.update(updateDto);
  }

  delete(deleteDto: Prisma.ClientDeleteArgs) {
    return this.prismaService.client.delete(deleteDto);
  }
}
