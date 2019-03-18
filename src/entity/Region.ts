import { Entity, Column, BaseEntity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { District } from "./District";

@Entity()
export class Region extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
        nullable: false,
        type: "varchar",
    })
    name: string;

    @OneToMany(type => District, district => district.region)
    districts: District[];
}
