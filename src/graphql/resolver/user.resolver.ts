import { Resolver, Query, ObjectType, Field, Int, Mutation, Args, InputType } from "@nestjs/graphql";
import { NotFoundException } from "@nestjs/common";

// Definição do tipo User para o GraphQL
@ObjectType()
class User {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;
}

@InputType()
class CreateUserInput {
    @Field()
    name: string;
}

@InputType()
class UpdateUserInput {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;
}

// Um resolver é um conjunto de queries, mutations e subscriptions que tratam de um determinado tipo ou funcionalidade
@Resolver(() => User)
export class UserResolver {
    private users: User[] = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
    ];
    private nextId = 3;

    @Query(() => [User])
    listUsers(): User[] {
        return this.users;
    }

    @Query(() => User, { nullable: true })
    getUser(@Args('id', { type: () => Int }) id: number): User | null {
        return this.users.find(user => user.id === id) || null;
    }

    @Mutation(() => User)
    createUser(@Args('input') input: CreateUserInput): User {
        const user: User = { id: this.nextId++, name: input.name };
        this.users.push(user);
        return user;
    }

    @Mutation(() => User)
    updateUser(@Args('input') input: UpdateUserInput): User {
        const user = this.users.find(u => u.id === input.id);
        if (!user) throw new NotFoundException(`User with id ${input.id} not found`);
        user.name = input.name;
        return user;
    }

    @Mutation(() => Boolean)
    deleteUser(@Args('id', { type: () => Int }) id: number): boolean {
        const idx = this.users.findIndex(u => u.id === id);
        if (idx === -1) throw new NotFoundException(`User with id ${id} not found`);
        this.users.splice(idx, 1);
        return true;
    }
}