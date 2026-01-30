/* eslint-disable prettier/prettier */
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Vote")
export class Vote {

      @PrimaryGeneratedColumn()
      id: number;
    
      @Column()
      status: boolean;
    
      @DeleteDateColumn()
      deletedAt : Date | null
    
}
