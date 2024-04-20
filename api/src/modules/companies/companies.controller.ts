import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CompaniesService } from './services/companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ActiveUserId } from 'src/shared/decorators/activeUserId';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateImageDto } from './dto/create-image.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  findAllByUserId(@ActiveUserId() userId: string) {
    return this.companiesService.findAllByUserId(userId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @ActiveUserId() userId: string,
    @Body() createCompanyDto: CreateCompanyDto,
    @UploadedFile() image: CreateImageDto,
  ) {
    return this.companiesService.create(userId, createCompanyDto, image);
  }

  @Put(':companyId')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @ActiveUserId() userId: string,
    @Param('companyId', ParseUUIDPipe) companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @UploadedFile() image: CreateImageDto,
  ) {
    return this.companiesService.update(
      userId,
      companyId,
      updateCompanyDto,
      image,
    );
  }

  @Delete(':companyId')
  remove(
    @ActiveUserId() userId: string,
    @Param('companyId', ParseUUIDPipe) companyId: string,
  ) {
    return this.companiesService.remove(userId, companyId);
  }
}
