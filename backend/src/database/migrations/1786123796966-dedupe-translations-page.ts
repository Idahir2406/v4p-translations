import { MigrationInterface, QueryRunner } from 'typeorm';

export class DedupeTranslationsPage1786123796966 implements MigrationInterface {
  name = 'DedupeTranslationsPage1786123796966';

  private readonly translationsTable = 'v4p_jclientes_translations';
  private readonly eventsTable = 'v4p_jtranslation_events';
  private readonly tablesTable = 'v4p_jtranslation_tables';
  private readonly unique5Index = 'IDX_10aea321b3016b8b3692aa137e';

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

  private async dropFourColumnUniques(queryRunner: QueryRunner): Promise<void> {
    const indexes = await queryRunner.query(
      `
        SELECT DISTINCT INDEX_NAME AS indexName
        FROM INFORMATION_SCHEMA.STATISTICS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = ?
          AND NON_UNIQUE = 0
          AND INDEX_NAME != 'PRIMARY'
        GROUP BY INDEX_NAME
        HAVING COUNT(*) = 4
           AND SUM(COLUMN_NAME IN ('table_name', 'lang', 'field', 'identifier')) = 4
           AND SUM(COLUMN_NAME = 'page') = 0
      `,
      [this.translationsTable],
    );

    for (const row of indexes as Array<{ indexName: string }>) {
      await queryRunner.query(
        `DROP INDEX \`${row.indexName}\` ON \`${this.translationsTable}\``,
      );
    }
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.dropFourColumnUniques(queryRunner);

    if (await this.hasIndex(queryRunner, this.translationsTable, this.unique5Index)) {
      await queryRunner.query(
        `DROP INDEX \`${this.unique5Index}\` ON \`${this.translationsTable}\``,
      );
    }

    await queryRunner.query(
      `UPDATE \`${this.translationsTable}\` SET \`page\` = '' WHERE \`page\` IS NULL`,
    );

    await queryRunner.query(`
      DELETE t1
      FROM \`${this.translationsTable}\` t1
      INNER JOIN \`${this.translationsTable}\` t2
        ON t1.table_name = t2.table_name
       AND t1.lang = t2.lang
       AND t1.field = t2.field
       AND t1.identifier = t2.identifier
       AND IFNULL(t1.page, '') = IFNULL(t2.page, '')
       AND t1.id < t2.id
    `);

    await queryRunner.query(
      `ALTER TABLE \`${this.translationsTable}\` MODIFY \`page\` varchar(255) NOT NULL DEFAULT ''`,
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX \`${this.unique5Index}\` ON \`${this.translationsTable}\` (\`table_name\`, \`lang\`, \`field\`, \`identifier\`, \`page\`)`,
    );

    if (!(await queryRunner.hasColumn(this.tablesTable, 'page_source'))) {
      await queryRunner.query(
        `ALTER TABLE \`${this.tablesTable}\` ADD \`page_source\` varchar(255) NULL`,
      );
    }

    await queryRunner.query(
      `UPDATE \`${this.tablesTable}\` SET \`page_source\` = 'variables0.pagina' WHERE \`table_name\` = 'variables1' AND (\`page_source\` IS NULL OR \`page_source\` = '')`,
    );

    if (!(await queryRunner.hasColumn(this.eventsTable, 'page'))) {
      await queryRunner.query(
        `ALTER TABLE \`${this.eventsTable}\` ADD \`page\` varchar(255) NOT NULL DEFAULT ''`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn(this.eventsTable, 'page')) {
      await queryRunner.query(
        `ALTER TABLE \`${this.eventsTable}\` DROP COLUMN \`page\``,
      );
    }

    if (await queryRunner.hasColumn(this.tablesTable, 'page_source')) {
      await queryRunner.query(
        `ALTER TABLE \`${this.tablesTable}\` DROP COLUMN \`page_source\``,
      );
    }

    if (await this.hasIndex(queryRunner, this.translationsTable, this.unique5Index)) {
      await queryRunner.query(
        `DROP INDEX \`${this.unique5Index}\` ON \`${this.translationsTable}\``,
      );
    }

    await queryRunner.query(
      `ALTER TABLE \`${this.translationsTable}\` MODIFY \`page\` varchar(255) NULL`,
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX \`${this.unique5Index}\` ON \`${this.translationsTable}\` (\`table_name\`, \`lang\`, \`field\`, \`identifier\`, \`page\`)`,
    );
  }
}
