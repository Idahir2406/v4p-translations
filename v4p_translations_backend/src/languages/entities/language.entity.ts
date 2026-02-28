import { Column, Entity, PrimaryColumn } from "typeorm";
import { envs } from "src/config/envs";

@Entity(`${envs.DB_INITIAL}languages`)
export class Language {
  @PrimaryColumn({ unique: true, length: 10 })
  code: string;

  @Column()
  name: string;

  @Column({ default: true })
  status: string;

  @Column({ default: false })
  is_default: boolean;
  
  @Column({ default: false })
  is_active: boolean;

}
