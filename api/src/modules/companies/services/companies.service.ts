import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { CompaniesRepository } from 'src/shared/database/repositories/companies.repositories';
import { supabaseClient } from 'src/shared/config/supabase';
import { CreateImageDto } from '../dto/create-image.dto';
import { env } from 'src/shared/config/env';
import { ValidateCompanyOwnershipService } from './validate-company-ownership.service';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly companiesRepo: CompaniesRepository,
    private readonly validateCompanyOwnershipService: ValidateCompanyOwnershipService,
  ) {}

  async findAllByUserId(userId: string) {
    const companies = await this.companiesRepo.findMany({
      where: {
        userId,
      },
    });

    const updatedCompanies = await Promise.all(
      companies.map(async ({ imageName, ...company }) => {
        const imagePath = await this.getImagePath(imageName);
        return { ...company, imagePath };
      }),
    );

    return updatedCompanies;
  }

  async create(
    userId: string,
    createCompanyDto: CreateCompanyDto,
    image: CreateImageDto,
  ) {
    const { name } = createCompanyDto;

    await this.validateCollaboratorAlreadyExists(userId, name);

    if (!image) {
      return this.companiesRepo.create({
        data: {
          userId,
          name,
          imageName: '',
        },
      });
    }

    await supabaseClient.storage
      .from(env.storageImagesName)
      .upload(`${userId}${image.originalname}`, image.buffer, {
        upsert: true,
        contentType: image.mimetype,
      });

    return this.companiesRepo.create({
      data: {
        userId,
        name,
        imageName: `${userId}${image.originalname}`,
      },
    });
  }

  async update(
    userId: string,
    companyId: string,
    updateCompanyDto: UpdateCompanyDto,
    image: CreateImageDto,
  ) {
    const { name } = updateCompanyDto;

    await this.validateCompanyOwnershipService.validate(userId, companyId);

    await this.validateCollaboratorAlreadyExists(userId, name, companyId);

    if (!image) {
      return this.companiesRepo.update({
        where: { id: companyId },
        data: {
          userId,
          name,
        },
      });
    }

    return this.companiesRepo.update({
      where: { id: companyId },
      data: {
        userId,
        imageName: `${userId}${image.originalname}`,
        name,
      },
    });
  }

  async remove(userId: string, companyId: string) {
    await this.validateCompanyOwnershipService.validate(userId, companyId);

    const company = await this.companiesRepo.findFirst({
      where: { userId },
    });

    await supabaseClient.storage
      .from(env.storageImagesName)
      .remove([company.imageName]);

    await this.companiesRepo.delete({
      where: {
        id: companyId,
      },
    });

    return null;
  }

  private async getImagePath(imageName: string) {
    const { data } = await supabaseClient.storage
      .from(env.storageImagesName)
      .createSignedUrl(imageName, 86400);

    return data.signedUrl;
  }

  private async validateCollaboratorAlreadyExists(
    userId: string,
    companyName: string,
    companyId?: string,
  ) {
    const collaboratorAlreadyExists = await this.companiesRepo.findFirst({
      where: {
        name: companyName,
        userId,
        NOT: {
          id: companyId,
        },
      },
    });

    if (collaboratorAlreadyExists) {
      throw new ConflictException('Company already exists');
    }
  }
}
