import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { envs } from "../../config/envs";
import { User } from "../../user/entities/user.entity";
import { Sites } from "./sites.entity";


@Entity(`${envs.DB_INITIAL}favorites`)
export class Favorites {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;


  @Column()
  site_id: number;

  @ManyToOne(() => Sites, (sites) => sites.favorites, { cascade: true })
  @JoinColumn({ name: 'site_id' })
  site: Sites;


  /**
   * Sin FK en BD: `v4p_jusers` es legacy y no coincide con la entidad `User` (id/email).
   * Evita que migraciones auto-generadas intenten reescribir `users`.
   */
  @ManyToOne(() => User, (user) => user.favorites, {
    cascade: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  
}