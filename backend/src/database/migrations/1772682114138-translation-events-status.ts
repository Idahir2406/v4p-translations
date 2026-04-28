import { MigrationInterface, QueryRunner } from "typeorm";

export class TranslationEventsStatus1772682114138 implements MigrationInterface {
    name = 'TranslationEventsStatus1772682114138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_events\` ADD \`status\` varchar(255) NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_tables\` CHANGE \`identifier\` \`identifier\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_tables\` CHANGE \`field_name\` \`field_name\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_tables\` CHANGE \`field_name\` \`field_name\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_tables\` CHANGE \`identifier\` \`identifier\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_events\` DROP COLUMN \`status\``);
    }

}
