

import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Favorites } from "../../favorites/entities/favorites.entity";
import { envs } from "../../config/envs";



@Entity(`${envs.DB_INITIAL}user_profiles`)
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true })
  email: string;

  @OneToMany(() => Favorites, (favorites) => favorites.user)
  favorites: Favorites[];

}