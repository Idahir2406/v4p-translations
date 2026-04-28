import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1772223811920 implements MigrationInterface {
  name = "InitSchema1772223811920";

  private async hasIndex(
    queryRunner: QueryRunner,
    table: string,
    indexName: string,
  ): Promise<boolean> {
    const result = await queryRunner.query(
      `SHOW INDEX FROM \`${table}\` WHERE Key_name = '${indexName}'`,
    );

    return result.length > 0;
  }

  private async hasPrimaryKey(
    queryRunner: QueryRunner,
    table: string,
  ): Promise<boolean> {
    const result = await queryRunner.query(
      `SHOW INDEX FROM \`${table}\` WHERE Key_name = 'PRIMARY'`,
    );

    return result.length > 0;
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const languagesTable = "v4p_jlanguages";
    const translationTables = "v4p_jtranslation_tables";

    if (await queryRunner.hasTable(languagesTable)) {
      if (!(await queryRunner.hasColumn(languagesTable, "status"))) {
        await queryRunner.query(
          `ALTER TABLE \`${languagesTable}\` ADD \`status\` varchar(255) NOT NULL DEFAULT '1'`,
        );
      }

      if (!(await queryRunner.hasColumn(languagesTable, "is_default"))) {
        await queryRunner.query(
          `ALTER TABLE \`${languagesTable}\` ADD \`is_default\` tinyint NOT NULL DEFAULT 0`,
        );
      }

      if (!(await queryRunner.hasColumn(languagesTable, "is_active"))) {
        await queryRunner.query(
          `ALTER TABLE \`${languagesTable}\` ADD \`is_active\` tinyint NOT NULL DEFAULT 0`,
        );
      }

      const idMetadata = await queryRunner.query(
        `
          SELECT DATA_TYPE AS dataType
          FROM INFORMATION_SCHEMA.COLUMNS
          WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = '${languagesTable}'
            AND COLUMN_NAME = 'id'
          LIMIT 1
        `,
      );

      if (idMetadata.length > 0 && idMetadata[0].dataType !== "varchar") {
        if (!(await queryRunner.hasColumn(languagesTable, "id_new"))) {
          await queryRunner.query(
            `ALTER TABLE \`${languagesTable}\` ADD \`id_new\` varchar(36) NULL`,
          );
        }

        await queryRunner.query(
          `UPDATE \`${languagesTable}\` SET \`id_new\` = UUID() WHERE \`id_new\` IS NULL OR \`id_new\` = ''`,
        );

        if (await this.hasPrimaryKey(queryRunner, languagesTable)) {
          await queryRunner.query(
            `ALTER TABLE \`${languagesTable}\` DROP PRIMARY KEY`,
          );
        }

        await queryRunner.query(
          `ALTER TABLE \`${languagesTable}\` DROP COLUMN \`id\``,
        );
        await queryRunner.query(
          `ALTER TABLE \`${languagesTable}\` CHANGE \`id_new\` \`id\` varchar(36) NOT NULL`,
        );
        await queryRunner.query(
          `ALTER TABLE \`${languagesTable}\` ADD PRIMARY KEY (\`id\`)`,
        );
      } else if (idMetadata.length > 0 && idMetadata[0].dataType === "varchar") {
        await queryRunner.query(
          `UPDATE \`${languagesTable}\` SET \`id\` = UUID() WHERE \`id\` IS NULL OR \`id\` = ''`,
        );

        if (!(await this.hasPrimaryKey(queryRunner, languagesTable))) {
          const duplicatedIds = await queryRunner.query(
            `
              SELECT id
              FROM \`${languagesTable}\`
              GROUP BY id
              HAVING COUNT(*) > 1
              LIMIT 1
            `,
          );

          if (duplicatedIds.length === 0) {
            await queryRunner.query(
              `ALTER TABLE \`${languagesTable}\` ADD PRIMARY KEY (\`id\`)`,
            );
          }
        }
      }

      if (await queryRunner.hasColumn(languagesTable, "code")) {
        await queryRunner.query(
          `ALTER TABLE \`${languagesTable}\` MODIFY \`code\` varchar(10) NOT NULL`,
        );
      }

      if (
        (await queryRunner.hasColumn(languagesTable, "code")) &&
        !(await this.hasIndex(queryRunner, languagesTable, "IDX_807184bdc32d901b403261d9bc"))
      ) {
        const duplicatedCodes = await queryRunner.query(
          `
            SELECT code
            FROM \`${languagesTable}\`
            GROUP BY code
            HAVING COUNT(*) > 1
            LIMIT 1
          `,
        );

        if (duplicatedCodes.length === 0) {
          await queryRunner.query(
            `ALTER TABLE \`${languagesTable}\` ADD UNIQUE INDEX \`IDX_807184bdc32d901b403261d9bc\` (\`code\`)`,
          );
        }
      }
    }

    if (await queryRunner.hasTable(translationTables)) {
      if (
        !(await this.hasIndex(queryRunner, translationTables, "IDX_2f1eedb0688fd490ba044e489e"))
      ) {
        const duplicatedTableNames = await queryRunner.query(
          `
            SELECT table_name
            FROM \`${translationTables}\`
            GROUP BY table_name
            HAVING COUNT(*) > 1
            LIMIT 1
          `,
        );

        if (duplicatedTableNames.length === 0) {
          await queryRunner.query(
            `ALTER TABLE \`${translationTables}\` ADD UNIQUE INDEX \`IDX_2f1eedb0688fd490ba044e489e\` (\`table_name\`)`,
          );
        }
      }

      if (await queryRunner.hasColumn(translationTables, "identifier")) {
        await queryRunner.query(
          `ALTER TABLE \`${translationTables}\` MODIFY \`identifier\` varchar(255) NULL`,
        );
      }

      if (await queryRunner.hasColumn(translationTables, "field_name")) {
        await queryRunner.query(
          `ALTER TABLE \`${translationTables}\` MODIFY \`field_name\` varchar(255) NULL`,
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const languagesTable = "v4p_jlanguages";
    const translationTables = "v4p_jtranslation_tables";

    if (await queryRunner.hasTable(languagesTable)) {
      if (await this.hasIndex(queryRunner, languagesTable, "IDX_807184bdc32d901b403261d9bc")) {
        await queryRunner.query(
          `ALTER TABLE \`${languagesTable}\` DROP INDEX \`IDX_807184bdc32d901b403261d9bc\``,
        );
      }

      if (await queryRunner.hasColumn(languagesTable, "is_active")) {
        await queryRunner.query(
          `ALTER TABLE \`${languagesTable}\` DROP COLUMN \`is_active\``,
        );
      }

      if (await queryRunner.hasColumn(languagesTable, "is_default")) {
        await queryRunner.query(
          `ALTER TABLE \`${languagesTable}\` DROP COLUMN \`is_default\``,
        );
      }

      if (await queryRunner.hasColumn(languagesTable, "status")) {
        await queryRunner.query(
          `ALTER TABLE \`${languagesTable}\` DROP COLUMN \`status\``,
        );
      }
    }

    if (await queryRunner.hasTable(translationTables)) {
      if (await this.hasIndex(queryRunner, translationTables, "IDX_2f1eedb0688fd490ba044e489e")) {
        await queryRunner.query(
          `ALTER TABLE \`${translationTables}\` DROP INDEX \`IDX_2f1eedb0688fd490ba044e489e\``,
        );
      }

      if (await queryRunner.hasColumn(translationTables, "field_name")) {
        await queryRunner.query(
          `ALTER TABLE \`${translationTables}\` MODIFY \`field_name\` varchar(255) NULL DEFAULT 'NULL'`,
        );
      }

      if (await queryRunner.hasColumn(translationTables, "identifier")) {
        await queryRunner.query(
          `ALTER TABLE \`${translationTables}\` MODIFY \`identifier\` varchar(255) NULL DEFAULT ''id''`,
        );
      }
    }
  }

}
