import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Language } from "./entities/language.entity";
import { CreateLanguageDto } from "./dto/create-language.dto";
import { UpdateLanguageDto } from "./dto/update-language.dto";

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  async create(dto: CreateLanguageDto): Promise<Language> {
    const entity = this.languageRepository.create(dto);
    return this.languageRepository.save(entity);
  }

  async findAll(): Promise<Language[]> {
    return this.languageRepository.find({ order: { code: "ASC" } });
  }

  async findOne(id: string): Promise<Language> {
    const entity = await this.languageRepository.findOneBy({ code: id });
    if (!entity) {
      throw new NotFoundException(`Language con id '${id}' no encontrado`);
    }
    return entity;
  }

  async update(id: string, dto: UpdateLanguageDto): Promise<Language> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.languageRepository.save(entity);
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const entity = await this.findOne(id);
    await this.languageRepository.remove(entity);
    return { deleted: true };
  }
}
