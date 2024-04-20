import { Injectable, NotFoundException } from '@nestjs/common';
import { CompaniesRepository } from 'src/shared/database/repositories/companies.repositories';

@Injectable()
export class ValidateCompanyOwnershipService {
  constructor(private readonly companiesRepo: CompaniesRepository) {}

  async validate(userId: string, companyId: string) {
    const isOwner = await this.companiesRepo.findFirst({
      where: {
        id: companyId,
        userId,
      },
    });

    if (!isOwner) {
      throw new NotFoundException('Company not found.');
    }
  }
}
