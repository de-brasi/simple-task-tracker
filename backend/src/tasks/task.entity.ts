import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../auth/user.entity";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { eager: true, nullable: false })
    @JoinColumn({ name: 'ownerId' })
    owner: User;

    @Column({type: 'varchar', length: 255})
    title: string;

    @Column({type: 'text'})
    description: string;

    // todo: зачем тип? Где используется, на что влияет
    @Column({type: 'varchar', length: 255})
    type: string;

    @ManyToOne(() => User, { eager: true, nullable: false })
    @JoinColumn({ name: 'executorId' })
    executor: User

    @Column({type: 'timestamp'})
    deadline: Date

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    creationDate: Date

    @Column({type: 'varchar', length: 255})
    status: string;

    @Column()
    progress: number;
}