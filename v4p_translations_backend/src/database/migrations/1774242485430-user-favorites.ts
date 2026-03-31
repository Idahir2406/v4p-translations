import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migración manual: solo crea `favorites` y FK hacia `sites1`.
 *
 * No uses `migration:generate` para esto: TypeORM genera cambios masivos
 * (ALTER users, CHANGE sites1, languages…) cuando la entidad `User` no refleja
 * la tabla real `v4p_jusers`.
 */
export class UserFavorites1774242485430 implements MigrationInterface {
  name = 'UserFavorites1774242485430';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`v4p_jfavorites\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`user_id\` int NOT NULL,
                \`site_id\` int NOT NULL,
                PRIMARY KEY (\`id\`),
                KEY \`FK_v4p_jfavorites_site\` (\`site_id\`)
            ) ENGINE=InnoDB
        `);

    const existingFk = await queryRunner.query(`
            SELECT CONSTRAINT_NAME
            FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'v4p_jfavorites'
              AND CONSTRAINT_TYPE = 'FOREIGN KEY'
              AND CONSTRAINT_NAME = 'FK_v4p_jfavorites_site'
        `);

    if (!existingFk.length) {
      await queryRunner.query(`
                ALTER TABLE \`v4p_jfavorites\`
                ADD CONSTRAINT \`FK_v4p_jfavorites_site\`
                FOREIGN KEY (\`site_id\`) REFERENCES \`v4p_jsites1\`(\`id\`)
                ON DELETE NO ACTION ON UPDATE NO ACTION
            `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const existingFk = await queryRunner.query(`
            SELECT CONSTRAINT_NAME
            FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'v4p_jfavorites'
              AND CONSTRAINT_TYPE = 'FOREIGN KEY'
              AND CONSTRAINT_NAME = 'FK_v4p_jfavorites_site'
        `);

    if (existingFk.length) {
      await queryRunner.query(
        `ALTER TABLE \`v4p_jfavorites\` DROP FOREIGN KEY \`FK_v4p_jfavorites_site\``,
      );
    }

    await queryRunner.query(`DROP TABLE IF EXISTS \`v4p_jfavorites\``);
  }
}
