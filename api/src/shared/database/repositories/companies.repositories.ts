import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class CompaniesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findMany<T = Prisma.CompanyFindManyArgs>(
    findManyDto: Prisma.SelectSubset<T, Prisma.CompanyFindManyArgs>,
  ) {
    return this.prismaService.company.findMany<T>(findManyDto);
  }

  findFirst(findFirstDto: Prisma.CompanyFindFirstArgs) {
    return this.prismaService.company.findFirst(findFirstDto);
  }

  create(createDto: Prisma.CompanyCreateArgs) {
    return this.prismaService.company.create(createDto);
  }

  update(updateDto: Prisma.CompanyUpdateArgs) {
    return this.prismaService.company.update(updateDto);
  }

  delete(deleteDto: Prisma.CompanyDeleteArgs) {
    return this.prismaService.company.delete(deleteDto);
  }
}
