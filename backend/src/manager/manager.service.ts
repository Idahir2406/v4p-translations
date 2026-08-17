import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TranslationTable } from "src/translation-tables/entities/translation-table.entity";
import { ClienteTranslation } from "src/translations/entities/clientTranslations.entity";
import { GetTranslationsDto } from "./dto/get-translations.dto";
import { UpdateTranslationDto } from "./dto/update-translation.dto";
import { envs } from "src/config/envs";

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(TranslationTable)
    private readonly translationTableRepository: Repository<TranslationTable>,
    @InjectRepository(ClienteTranslation)
    private readonly clienteTranslationRepository: Repository<ClienteTranslation>,
  ) {}

  private getFullTableName(tableName: string): string {
    return `${envs.DB_PREFIX}${tableName}`;
  }

  async getFilterOptions(id: string) {
    const translationTable = await this.translationTableRepository.findOneBy({ id });

    if (!translationTable) {
      throw new NotFoundException(`TranslationTable con id '${id}' no encontrada`);
    }

    const fullTableName = this.getFullTableName(translationTable.table_name);

    const [fieldsRaw, langsRaw, pagesRaw, countRaw] = await Promise.all([
      this.clienteTranslationRepository
        .createQueryBuilder("ct")
        .select("DISTINCT ct.field", "field")
        .where("ct.table_name = :tableName", { tableName: fullTableName })
        .orderBy("ct.field", "ASC")
        .getRawMany<{ field: string }>(),
      this.clienteTranslationRepository
        .createQueryBuilder("ct")
        .select("DISTINCT ct.lang", "lang")
        .where("ct.table_name = :tableName", { tableName: fullTableName })
        .orderBy("ct.lang", "ASC")
        .getRawMany<{ lang: string }>(),
      this.clienteTranslationRepository
        .createQueryBuilder("ct")
        .select("DISTINCT ct.page", "page")
        .where("ct.table_name = :tableName", { tableName: fullTableName })
        .orderBy("ct.page", "ASC")
        .getRawMany<{ page: string }>(),
      this.clienteTranslationRepository
        .createQueryBuilder("ct")
        .select("COUNT(*)", "total")
        .where("ct.table_name = :tableName", { tableName: fullTableName })
        .getRawOne<{ total: string }>(),
    ]);

    return {
      translationTable,
      fields: fieldsRaw.map((r) => r.field),
      langs: langsRaw.map((r) => r.lang),
      pages: pagesRaw.map((r) => r.page ?? ""),
      totalTranslations: Number(countRaw?.total ?? 0),
    };
  }

  async getTranslations(dto: GetTranslationsDto) {
    const { id, lang, field, page } = dto;
    const translationTable = await this.translationTableRepository.findOneBy({ id });

    if (!translationTable) {
      throw new NotFoundException(`TranslationTable con id '${id}' no encontrada`);
    }

    const fullTableName = this.getFullTableName(translationTable.table_name);

    const query = this.clienteTranslationRepository
      .createQueryBuilder("ct")
      .where("ct.table_name = :tableName", { tableName: fullTableName });

    if (lang) {
      query.andWhere("ct.lang = :lang", { lang });
    }

    if (field) {
      query.andWhere("ct.field = :field", { field });
    }

    if (page !== undefined) {
      query.andWhere("ct.page = :page", { page: page ?? "" });
    }

    query
      .orderBy("ct.identifier", "ASC")
      .addOrderBy("ct.field", "ASC")
      .addOrderBy("ct.lang", "ASC")
      .addOrderBy("ct.page", "ASC");

    const clienteTranslations = await query.getMany();

    return {
      translationTable,
      clienteTranslations,
    };
  }

  async deleteTranslation(id: number) {
    const translation = await this.clienteTranslationRepository.findOneBy({ id });

    if (!translation) {
      throw new NotFoundException(`Traducción con id '${id}' no encontrada`);
    }

    return this.clienteTranslationRepository.remove(translation);
  }

  async updateTranslation(id: number, dto: UpdateTranslationDto) {
    const updated = await this.clienteTranslationRepository.preload({
      id,
      value: dto.value,
    });

    if (!updated) {
      throw new NotFoundException(`Traducción con id '${id}' no encontrada`);
    }

    return this.clienteTranslationRepository.save(updated);
  }
}
