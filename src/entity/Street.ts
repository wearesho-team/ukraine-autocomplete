import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class Street extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
        type: "int",
    })
    town_id: number;

    @Column({
        nullable: false,
        type: "varchar",
        length: 16,
    })
    type: string;

    @Column({
        nullable: false,
        type: "varchar",
    })
    name: string;
}
