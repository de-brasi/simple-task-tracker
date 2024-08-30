import {Check, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('users')
// todo: создать отдельную таблицу или enum для ролей ["ADMIN", "USER"]
@Check(`"role" IN ('user', 'admin')`)
export class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({nullable: false, unique: true})
    public login: string;

    @Column({nullable: false})
    public password: string;

    @Column({nullable: false})
    public role: string;
}