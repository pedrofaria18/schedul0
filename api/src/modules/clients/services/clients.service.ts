import { ConflictException, Injectable } from '@nestjs/common';
import { ClientsRepository } from 'src/shared/database/repositories/clients.repositories';
import { ValidateCompanyOwnershipService } from '../../companies/services/validate-company-ownership.service';
import { ValidateClientOwnershipService } from './validate-client-ownership.service';
import { CreateClientDto } from '../dto/create-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    private readonly clientsRepo: ClientsRepository,
    private readonly validateCompanyOwnershipService: ValidateCompanyOwnershipService,
    private readonly validateClientOwnershipService: ValidateClientOwnershipService,
  ) {}

  async findAllByCompanyId(userId: string, companyId: string) {
    await this.validateCompanyOwnershipService.validate(userId, companyId);

    return this.clientsRepo.findMany({
      where: {
        companyId,
      },
    });
  }

  async findOne(userId: string, clientId: string) {
    await this.validateClientOwnershipService.validate(userId, clientId);

    return this.clientsRepo.findFirst({
      where: {
        id: clientId,
      },
    });
  }

  async create(
    userId: string,
    companyId: string,
    createClientDto: CreateClientDto,
  ) {
    const { email, firstName, lastName, phone, id } = createClientDto;

    await this.validateCompanyOwnershipService.validate(userId, companyId);

    await this.validateClientAlreadyExists(companyId, email, id);

    if (id) {
      await this.validateClientOwnershipService.validate(userId, id);

      return this.clientsRepo.update({
        where: {
          id,
        },
        data: {
          email,
          firstName,
          lastName,
          phone,
          companyId,
        },
      });
    }

    return this.clientsRepo.create({
      data: {
        email,
        firstName,
        lastName,
        phone,
        companyId,
      },
    });
  }

  private async validateClientAlreadyExists(
    companyId: string,
    clientEmail: string,
    clientId?: string,
  ) {
    const service = await this.clientsRepo.findFirst({
      where: {
        email: clientEmail,
        company: {
          id: companyId,
        },
        NOT: {
          id: clientId,
        },
      },
    });

    if (service) {
      throw new ConflictException('Client already exists');
    }
  }
}
