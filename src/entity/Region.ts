import { Entity, Column, BaseEntity, OneToMany, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
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

    @OneToMany(() => District, district => district.region)
    @JoinColumn({ name: "id", referencedColumnName: "region_id" })
    districts: District[];
}
