import { MigrationInterface, QueryRunner } from "typeorm";

export class TranslationEvents1772681862742 implements MigrationInterface {
    name = 'TranslationEvents1772681862742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`v4p_jtranslation_events\` (\`id\` int NOT NULL AUTO_INCREMENT, \`table_name\` varchar(255) NOT NULL, \`field\` varchar(255) NOT NULL, \`new_value\` text NOT NULL, \`identifier\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_tables\` CHANGE \`identifier\` \`identifier\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_tables\` CHANGE \`field_name\` \`field_name\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_tables\` CHANGE \`field_name\` \`field_name\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_tables\` CHANGE \`identifier\` \`identifier\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`DROP TABLE \`v4p_jtranslation_events\``);
    }

}
