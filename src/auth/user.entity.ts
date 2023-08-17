import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  role: string;

  @Column()
  opt_for_whatsapp_message: boolean;

  @Column()
  password: string; //This is a one time password. We call it OTP in the other places of the system.
}
