import {sha256Encrypt} from "../utils/sha256Encrypt";

export type User = {
    id: string
    name: string
    email: string
    password: string
}


const users: User[] = [
    {
        id: '4e6cb539-26d3-4878-ac17-9aba43bb278f',
        name: 'Shunyuan Deng',
        email: 'sden406@aucklanduni.ac.nz',
        password: sha256Encrypt('123456', 'sden406@aucklanduni.ac.nz')
    },
    {
        id: 'c900b339-3f21-4adc-961f-303f2093943e',
        name: 'Marker',
        email: 'marker@aucklanduni.ac.nz',
        password: sha256Encrypt('111111', 'marker@aucklanduni.ac.nz')
    },
    {
        id: '057fc87c-1275-4753-af57-fec59d10522e',
        name: 'Reviewer',
        email: 'reviewer@aucklanduni.ac.nz',
        password: sha256Encrypt('654321', 'reviewer@aucklanduni.ac.nz')
    }
]

export class UserRepository {
    public getByEmail(email: string): User | null {
        return users.find((user: User) => user.email === email) ?? null
    }

    public getByEmailOrThrow(email: string): User {
        const user = this.getByEmail(email)

        if (!user) {
            throw new Error("User is not found")
        }

        return user
    }
}