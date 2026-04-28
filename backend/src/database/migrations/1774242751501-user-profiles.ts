import { MigrationInterface, QueryRunner } from "typeorm";

export class UserProfiles1774242751501 implements MigrationInterface {
    name = 'UserProfiles1774242751501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`v4p_jfavorites\` DROP FOREIGN KEY \`FK_v4p_jfavorites_site\``);
        await queryRunner.query(`CREATE TABLE \`v4p_juser_profiles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_76f11db054b259832626b25161\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`name\` \`name\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`fechainscr\` \`fechainscr\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`active\` \`active\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`premium\` \`premium\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`alias_l1\` \`alias_l1\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`poblacio\` \`poblacio\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`alias_poblacio\` \`alias_poblacio\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`provincia\` \`provincia\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`interes\` \`interes\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`alias_interes\` \`alias_interes\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`email\` \`email\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`email2\` \`email2\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`telefono\` \`telefono\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`destacado\` \`destacado\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`precio\` \`precio\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`tipsite\` \`tipsite\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`tipdest\` \`tipdest\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`tiprent\` \`tiprent\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`tipspec\` \`tipspec\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`tipserv\` \`tipserv\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`cercapn\` \`cercapn\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`cercapl\` \`cercapl\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`cercaru\` \`cercaru\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`cercazr\` \`cercazr\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`cercamm\` \`cercamm\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`distancia\` \`distancia\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`ubicacion\` \`ubicacion\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`suborden\` \`suborden\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`reserva\` \`reserva\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`web\` \`web\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`geolat\` \`geolat\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`geolng\` \`geolng\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`promocion\` \`promocion\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`link_booking\` \`link_booking\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`link_ownbook\` \`link_ownbook\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`code_ownbook\` \`code_ownbook\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`image1\` \`image1\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`password\` \`password\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`accepted\` \`accepted\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`seocaption_l1\` \`seocaption_l1\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`seocaption_l2\` \`seocaption_l2\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`seodescription_l1\` \`seodescription_l1\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`seodescription_l2\` \`seodescription_l2\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_tables\` ADD UNIQUE INDEX \`IDX_2f1eedb0688fd490ba044e489e\` (\`table_name\`)`);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_tables\` CHANGE \`identifier\` \`identifier\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_tables\` CHANGE \`field_name\` \`field_name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`v4p_jlanguages\` ADD PRIMARY KEY (\`code\`)`);
        await queryRunner.query(`ALTER TABLE \`v4p_jfavorites\` ADD CONSTRAINT \`FK_9875a04e8a3202424642c8e92d1\` FOREIGN KEY (\`site_id\`) REFERENCES \`v4p_jsites1\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`v4p_jfavorites\` DROP FOREIGN KEY \`FK_9875a04e8a3202424642c8e92d1\``);
        await queryRunner.query(`ALTER TABLE \`v4p_jlanguages\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_tables\` CHANGE \`field_name\` \`field_name\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_tables\` CHANGE \`identifier\` \`identifier\` varchar(255) NULL DEFAULT ''id''`);
        await queryRunner.query(`ALTER TABLE \`v4p_jtranslation_tables\` DROP INDEX \`IDX_2f1eedb0688fd490ba044e489e\``);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`seodescription_l2\` \`seodescription_l2\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`seodescription_l1\` \`seodescription_l1\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`seocaption_l2\` \`seocaption_l2\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`seocaption_l1\` \`seocaption_l1\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`accepted\` \`accepted\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`password\` \`password\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`image1\` \`image1\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`code_ownbook\` \`code_ownbook\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`link_ownbook\` \`link_ownbook\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`link_booking\` \`link_booking\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`promocion\` \`promocion\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`geolng\` \`geolng\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`geolat\` \`geolat\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`web\` \`web\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`reserva\` \`reserva\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`suborden\` \`suborden\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`ubicacion\` \`ubicacion\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`distancia\` \`distancia\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`cercamm\` \`cercamm\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`cercazr\` \`cercazr\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`cercaru\` \`cercaru\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`cercapl\` \`cercapl\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`cercapn\` \`cercapn\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`tipserv\` \`tipserv\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`tipspec\` \`tipspec\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`tiprent\` \`tiprent\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`tipdest\` \`tipdest\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`tipsite\` \`tipsite\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`precio\` \`precio\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`destacado\` \`destacado\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`telefono\` \`telefono\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`email2\` \`email2\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`email\` \`email\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`alias_interes\` \`alias_interes\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`interes\` \`interes\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`provincia\` \`provincia\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`alias_poblacio\` \`alias_poblacio\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`poblacio\` \`poblacio\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`alias_l1\` \`alias_l1\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`premium\` \`premium\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`active\` \`active\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`fechainscr\` \`fechainscr\` date NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`v4p_jsites1\` CHANGE \`name\` \`name\` text CHARACTER SET "utf8" COLLATE "utf8_general_ci" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`DROP INDEX \`IDX_76f11db054b259832626b25161\` ON \`v4p_juser_profiles\``);
        await queryRunner.query(`DROP TABLE \`v4p_juser_profiles\``);
        await queryRunner.query(`ALTER TABLE \`v4p_jfavorites\` ADD CONSTRAINT \`FK_v4p_jfavorites_site\` FOREIGN KEY (\`site_id\`) REFERENCES \`v4p_jsites1\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
