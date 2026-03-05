import { MigrationInterface, QueryRunner } from "typeorm";

export class TranslationEventsDateColumns1772683691310 implements MigrationInterface {
    name = 'TranslationEventsDateColumns1772683691310'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_events\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_events\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_tables\` CHANGE \`identifier\` \`identifier\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_tables\` CHANGE \`field_name\` \`field_name\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_tables\` CHANGE \`field_name\` \`field_name\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_tables\` CHANGE \`identifier\` \`identifier\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_events\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_events\` DROP COLUMN \`created_at\``);
    }

}
