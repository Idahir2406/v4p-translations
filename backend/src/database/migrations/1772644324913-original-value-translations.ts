import { MigrationInterface, QueryRunner } from "typeorm";

export class OriginalValueTranslations1772644324913 implements MigrationInterface {
    name = 'OriginalValueTranslations1772644324913'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_807184bdc32d901b403261d9bc\` ON \`v4p_jlanguages\``);
        await queryRunner.query(`ALTER TABLE \`v4p_jclientes_translations\` ADD \`original_value\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_tables\` ADD UNIQUE INDEX \`IDX_2f1eedb0688fd490ba044e489e\` (\`table_name\`)`);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_tables\` CHANGE \`identifier\` \`identifier\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_tables\` CHANGE \`field_name\` \`field_name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jlanguages\` ADD PRIMARY KEY (\`code\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`v4p_jlanguages\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_tables\` CHANGE \`field_name\` \`field_name\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_tables\` CHANGE \`identifier\` \`identifier\` varchar(255) NULL DEFAULT ''id''`);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_tables\` DROP INDEX \`IDX_2f1eedb0688fd490ba044e489e\``);
        await queryRunner.query(`ALTER TABLE \`v4p_jclientes_translations\` DROP COLUMN \`original_value\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_807184bdc32d901b403261d9bc\` ON \`v4p_jlanguages\` (\`code\`)`);
    }

}
