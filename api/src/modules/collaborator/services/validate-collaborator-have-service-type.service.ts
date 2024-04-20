import { Injectable, NotFoundException } from '@nestjs/common';
import { CollaboratorsRepository } from 'src/shared/database/repositories/collaborators.repositories';

@Injectable()
export class ValidateCollaboratorHaveServiceTypeService {
  constructor(private readonly collaboratorsRepo: CollaboratorsRepository) {}

  async validate(collaboratorId: string, serviceTypeId: string) {
    const collaborator = await this.collaboratorsRepo.findFirst({
      where: {
        id: collaboratorId,
        serviceTypes: {
          some: {
            id: serviceTypeId,
          },
        },
      },
    });

    if (!collaborator) {
      throw new NotFoundException(
        'The collaborator is not linked to this service type.',
      );
    }
  }

  async validateMany(collaboratorId: string, serviceTypesIds: string[]) {
    const collaborator = await this.collaboratorsRepo.findFirst({
      where: {
        id: collaboratorId,
        serviceTypes: {
          every: {
            id: {
              in: serviceTypesIds,
            },
          },
        },
      },
    });

    if (!collaborator) {
      throw new NotFoundException(
        'The collaborator is not linked to one or more service types.',
      );
    }
  }
}
