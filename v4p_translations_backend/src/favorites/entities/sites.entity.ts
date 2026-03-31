import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { envs } from '../../config/envs';
import { Favorites } from './favorites.entity';

/** Mapea la tabla física existente (p. ej. `v4p_jsites1`). */
@Entity(`${envs.DB_INITIAL}sites1`)
export class Sites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 99, default: '' })
  customer: string;

  @Column({ type: 'int' })
  idback: number;

  @Column('text', { nullable: true })
  name: string | null;

  @Column('date', { nullable: true })
  fechainscr: string | null;

  @Column('text', { nullable: true })
  active: string | null;

  @Column({ type: 'int', nullable: true })
  premium: number | null;

  @Column('text', { nullable: true })
  alias_l1: string | null;

  @Column({ type: 'int' })
  id_poblacion: number;

  @Column('text', { nullable: true })
  poblacio: string | null;

  @Column('text', { nullable: true })
  alias_poblacio: string | null;

  @Column('text', { nullable: true })
  provincia: string | null;

  @Column({ type: 'int' })
  id_provincia: number;

  @Column('text', { nullable: true })
  interes: string | null;

  @Column('text', { nullable: true })
  alias_interes: string | null;

  @Column('text', { nullable: true })
  email: string | null;

  @Column('text', { nullable: true })
  email2: string | null;

  @Column('text', { nullable: true })
  telefono: string | null;

  @Column('text', { nullable: true })
  destacado: string | null;

  @Column({ type: 'int', nullable: true, default: 0 })
  id_club4patas: number | null;

  @Column('text', { nullable: true })
  precio: string | null;

  @Column('text', { nullable: true })
  tipsite: string | null;

  @Column('text', { nullable: true })
  tipdest: string | null;

  @Column('text', { nullable: true })
  tiprent: string | null;

  @Column('text', { nullable: true })
  tipspec: string | null;

  @Column('text', { nullable: true })
  tipserv: string | null;

  @Column('text', { nullable: true })
  cercapn: string | null;

  @Column('text', { nullable: true })
  cercapl: string | null;

  @Column('text', { nullable: true })
  cercaru: string | null;

  @Column('text', { nullable: true })
  cercazr: string | null;

  @Column('text', { nullable: true })
  cercamm: string | null;

  @Column('text', { nullable: true })
  distancia: string | null;

  @Column('text', { nullable: true })
  ubicacion: string | null;

  @Column('text', { nullable: true })
  suborden: string | null;

  @Column({ type: 'int' })
  contador: number;

  @Column({ type: 'int' })
  contador_form: number;

  @Column({ type: 'int' })
  contador_web: number;

  @Column({ type: 'int' })
  contador_res: number;

  @Column({ type: 'int' })
  contador_tel: number;

  @Column('text', { nullable: true })
  reserva: string | null;

  @Column('text', { nullable: true })
  web: string | null;

  @Column('text', { nullable: true })
  geolat: string | null;

  @Column('text', { nullable: true })
  geolng: string | null;

  @Column('text', { nullable: true })
  promocion: string | null;

  @Column('text', { nullable: true })
  link_booking: string | null;

  @Column('text', { nullable: true })
  link_ownbook: string | null;

  @Column('text', { nullable: true })
  code_ownbook: string | null;

  @Column('text', { nullable: true })
  image1: string | null;

  @Column('text', { nullable: true })
  password: string | null;

  @Column('text', { nullable: true })
  accepted: string | null;

  @Column('text', { nullable: true })
  seocaption_l1: string | null;

  @Column('text', { nullable: true })
  seocaption_l2: string | null;

  @Column('text', { nullable: true })
  seodescription_l1: string | null;

  @Column('text', { nullable: true })
  seodescription_l2: string | null;

  @Column('text')
  whatsapp_phone: string;

  @OneToMany(() => Favorites, (favorites) => favorites.site)
  favorites: Favorites[];
}
