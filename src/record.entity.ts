
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  domain: string;

  @Column({ length: 4, nullable: true })
  type: string;

  @Column({ length: 255 })
  value: string;
}