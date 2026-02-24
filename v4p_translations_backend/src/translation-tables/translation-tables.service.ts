import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TranslationTable } from "./entities/translation-table.entity";
import { CreateTranslationTableDto } from "./dto/create-translation-table.dto";
import { UpdateTranslationTableDto } from "./dto/update-translation-table.dto";

@Injectable()
export class TranslationTablesService {
  constructor(
    @InjectRepository(TranslationTable)
    private readonly translationTableRepository: Repository<TranslationTable>,
  ) {}

  async create(dto: CreateTranslationTableDto): Promise<TranslationTable> {
    const entity = this.translationTableRepository.create({
      ...dto,
      identifier: dto.identifier ?? null,
      field_name: dto.field_name ?? null,
    });
    return this.translationTableRepository.save(entity);
  }

  async findAll(): Promise<TranslationTable[]> {
    return this.translationTableRepository.find({
      order: { table_name: "ASC" },
    });
  }

  async findOne(id: string): Promise<TranslationTable> {
    const entity = await this.translationTableRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`TranslationTable con id '${id}' no encontrada`);
    }
    return entity;
  }

  async update(
    id: string,
    dto: UpdateTranslationTableDto,
  ): Promise<TranslationTable> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.translationTableRepository.save(entity);
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const entity = await this.findOne(id);
    await this.translationTableRepository.remove(entity);
    return { deleted: true };
  }
}
