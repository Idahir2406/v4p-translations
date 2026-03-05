import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { envs } from "../../config/envs";

@Entity(`${envs.DB_INITIAL}translation_tables`)
export class TranslationTable {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  table_name: string;

  @Column({ type: "json" })
  columns: string[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  identifier: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  field_name: string | null;
}
