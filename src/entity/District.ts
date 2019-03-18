import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from "typeorm";
import { Region } from "./Region";

@Entity()
export class District extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "int",
        nullable: false,
    })
    region_id: number;

    @Column({
        type: "varchar",
        nullable: false,
    })
    name: string;

    @ManyToOne(type => Region, region => region.districts)
    @JoinColumn({ name: "region_id", referencedColumnName: "id", })
    region: Region;
}
