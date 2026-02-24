import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { envs } from "src/config/envs";

@Entity(`${envs.DB_INITIAL}languages`)
export class Language {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true, length: 10 })
  code: string;

  @Column()
  name: string;
}
