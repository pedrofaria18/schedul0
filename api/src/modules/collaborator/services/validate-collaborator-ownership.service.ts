import { Injectable, NotFoundException } from '@nestjs/common';
import { CollaboratorsRepository } from 'src/shared/database/repositories/collaborators.repositories';

@Injectable()
export class ValidateCollaboratorOwnershipService {
  constructor(private readonly collaboratorsRepo: CollaboratorsRepository) {}

  async validate(userId: string, collaboratorId: string) {
    const isOwner = await this.collaboratorsRepo.findFirst({
      where: {
        id: collaboratorId,
        company: {
          userId,
        },
      },
    });

    if (!isOwner) {
      throw new NotFoundException('Collaborator not found.');
    }
  }
}
