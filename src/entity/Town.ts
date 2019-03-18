import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

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
        type: "varchar",
    })
    type: string;

    @Column({
        nullable: false,
        type: "varchar",
    })
    name: string;
}
