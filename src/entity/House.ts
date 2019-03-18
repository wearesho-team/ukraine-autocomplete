import { Entity, PrimaryColumn, BaseEntity } from "typeorm";

@Entity()
export class House extends BaseEntity {
    @PrimaryColumn({
        nullable: false,
        type: "int",
        generated: false,
    })
    street_id: number;

    @PrimaryColumn({
        nullable: false,
        type: "varchar",
        length: 18,
        generated: false,
    })
    number: string;
}
