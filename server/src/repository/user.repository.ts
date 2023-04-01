import {sha256Encrypt} from "../utils/sha256Encrypt";

export type User = {
    id: string
    name: string
    email: string
    password: string
}


const users: User[] = [
    {
        id: 'fca03c0e-ea8e-4775-aa02-f5a3d56d35e7',
        name: 'Shunyuan Deng',
        email: 'sden406@aucklanduni.ac.nz',
        password: sha256Encrypt('123456', 'sden406@aucklanduni.ac.nz')
    },
    {
        id: 'b5eb0ec5-d8b5-466a-bc10-f6829b48461f',
        name: 'Marker',
        email: 'marker@aucklanduni.ac.nz',
        password: sha256Encrypt('111111', 'marker@aucklanduni.ac.nz')
    },
    {
        id: 'bfc8e1a6-9687-44d9-9771-1b4fcfebfe6d',
        name: 'Reviewer',
        email: 'reviewer@aucklanduni.ac.nz',
        password: sha256Encrypt('654321', 'reviewer@aucklanduni.ac.nz')
    },
    {
        id: 'bfc8e1a6-9687-44d9-9771-1b4fcfebfe6da',
        name: 'Guest',
        email: 'guest@aucklanduni.ac.nz',
        password: sha256Encrypt('333333', 'guest@aucklanduni.ac.nz')
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

    public getById(id: string): User | null {
        return users.find((user:User) => user.id === id) ?? null
    }

    public getByIdOrThrow(id: string): User {
        const user = this.getById(id)

        if (!user) {
            throw new Error("User not found")
        }

        return user
    }

    public listAllUsers(): User[] {
        return users
    }
}