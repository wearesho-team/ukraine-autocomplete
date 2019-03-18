import { Entity, Column, BaseEntity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Region } from "./Region";
import { Town } from "./Town";

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
        length: 32,
        nullable: false,
    })
    name: string;

    @ManyToOne(() => Region, region => region.districts)
    @JoinColumn({ name: "region_id", referencedColumnName: "id", })
    region: Region;

    @OneToMany(() => Town, town => town.district)
    @JoinColumn({ name: "id", referencedColumnName: "district_id", })
    towns: Town[];
}
