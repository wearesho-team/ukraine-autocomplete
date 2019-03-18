import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateHouse1552915353911 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "house",
            columns: [
                {
                    name: "street_id",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "number",
                    type: "int",
                    isNullable: false,
                },
            ]
        }));

        await queryRunner.createPrimaryKey(
            "house",
            [ "street_id", "number", ]
        );

        await queryRunner.createForeignKey("house", new TableForeignKey({
            name: "fk_house_street",
            columnNames: [ "street_id", ],
            referencedTableName: "street",
            referencedColumnNames: [ "id", ],
            onUpdate: "cascade",
            onDelete: "cascade",
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("house");
    }
}
