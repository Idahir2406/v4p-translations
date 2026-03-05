import { envs } from "../../config/envs";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity(`${envs.DB_INITIAL}translation_events`)
export class TranslationEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  table_name: string;

  @Column()
  field: string;

  @Column('text')
  new_value: string;

  @Column()
  identifier: string;

  @Column({default: 'pending'})
  status: string;


  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}
