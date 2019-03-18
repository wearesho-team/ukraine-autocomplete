import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from "typeorm";
import { District } from "./District";
import { TownType } from "../data";

@Entity()
export class Town extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
        type: "int",
    })
    district_id: number;

    @Column({
        nullable: false,
        type: "enum",
        enum: Object.values(TownType),
    })
    type: TownType;

    @Column({
        nullable: false,
        type: "varchar",
    })
    name: string;

    @ManyToOne(() => District, district => district.towns)
    @JoinColumn({ name: "district_id", referencedColumnName: "id", })
    district: District;
}
