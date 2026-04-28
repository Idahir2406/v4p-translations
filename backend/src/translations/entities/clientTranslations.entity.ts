import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { envs } from '../../config/envs';

@Entity(`${envs.DB_INITIAL}clientes_translations`)
@Index(['table_name', 'lang', 'field', 'identifier'], { unique: true })
export class ClienteTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  table_name: string;

  @Column({ length: 2 })
  lang: string;

  @Column()
  field: string;

  @Column('text')
  value: string;

  @Column()
  identifier: string;


}
