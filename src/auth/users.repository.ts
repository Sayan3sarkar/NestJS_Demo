import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDTO } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User>{
    public async createUser(authCredentialsDTO: AuthCredentialsDTO): Promise<void>{
        const {email, password} = authCredentialsDTO;

        // Generate hashed password
        const salt = await bcrypt.genSalt();
        const hashedPw = await bcrypt.hash(password, salt);

        const newUser = this.create({email, password: hashedPw});
        
        try {
            await this.save(newUser);
        } catch(error) {
            if(error.code == 23505){ // duplicate code for Postgres
                throw new ConflictException(`A user with the email: ${email} already exists`);
            } else {
                throw new InternalServerErrorException();
            }
        }
    }
}