import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class CollaboratorsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findMany<T = Prisma.CollaboratorFindManyArgs>(
    findManyDto: Prisma.SelectSubset<T, Prisma.CollaboratorFindManyArgs>,
  ) {
    return this.prismaService.collaborator.findMany<T>(findManyDto);
  }

  findFirst(findFirstDto: Prisma.CollaboratorFindFirstArgs) {
    return this.prismaService.collaborator.findFirst(findFirstDto);
  }

  create(createDto: Prisma.CollaboratorCreateArgs) {
    return this.prismaService.collaborator.create(createDto);
  }

  update(updateDto: Prisma.CollaboratorUpdateArgs) {
    return this.prismaService.collaborator.update(updateDto);
  }

  delete(deleteDto: Prisma.CollaboratorDeleteArgs) {
    return this.prismaService.collaborator.delete(deleteDto);
  }
}
