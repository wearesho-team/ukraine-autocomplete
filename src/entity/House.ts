import { Entity, PrimaryColumn, BaseEntity } from "typeorm";

@Entity()
export class House extends BaseEntity {
    @PrimaryColumn({
        nullable: false,
        type: "int",
    })
    street_id: number;

    @PrimaryColumn({
        nullable: false,
        type: "smallint",
    })
    number: number;
}
