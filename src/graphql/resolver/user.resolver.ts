import { Resolver, Query, ObjectType, Field, Int, Mutation, Args, InputType, ResolveField, Parent, Subscription } from "@nestjs/graphql";
import { NotFoundException } from "@nestjs/common";
import { MinLength } from "class-validator";
import { PubSub } from "graphql-subscriptions";

// Definição do tipo Post (post do usuário) para o GraphQL
@ObjectType()
class Post {
    @Field(() => Int)
    id: number;

    @MinLength(5, { message: 'Title must be at least 5 characters long' })
    @Field()
    title: string;

    @MinLength(10, { message: 'Content must be at least 10 characters long' })
    @Field()
    content: string;

    @Field(() => Int)
    authorId: number;
}

// Definição do tipo User para o GraphQL
@ObjectType()
class User {
    @Field(() => Int)
    id: number;

    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    @Field()
    name: string;
}

@InputType()
class CreateUserInput {
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    @Field()
    name: string;
}

@InputType()
class UpdateUserInput {
    @Field(() => Int)
    id: number;

    @Field()
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    name: string;
}

@InputType()
class PaginationArgs {
    @Field(() => Int, { defaultValue: 0 })
    skip: number;

    @Field(() => Int, { defaultValue: 10 })
    take: number;
}

// Um resolver é um conjunto de queries, mutations e subscriptions que tratam de um determinado tipo ou funcionalidade
@Resolver(() => User)
export class UserResolver {
    constructor(
        private readonly pubSub: PubSub
    ) {}

    private users: User[] = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Alice Johnson' },
        { id: 4, name: 'Bob Brown' },
        { id: 5, name: 'Charlie Davis' },
    ];

    private currentPosts: Post[] = [
        { id: 1, title: 'First Post', content: 'This is the content of the first post.', authorId: 1 },
        { id: 2, title: 'Second Post', content: 'This is the content of the second post.', authorId: 1 },
        { id: 3, title: 'Third Post', content: 'This is the content of the third post.', authorId: 2 },
    ];

    @Query(() => [User])
    listUsers(@Args('pagination', { nullable: true }) pagination?: PaginationArgs): User[] {
        const { skip = 0, take = 10 } = pagination || {};
        return this.users.slice(skip, skip + take);
    }

    @Query(() => User, { nullable: true })
    getUser(@Args('id', { type: () => Int }) id: number): User | null {
        const user = this.users.find(user => user.id === id) || null;
        return user;
    }

    @Mutation(() => User)
    createUser(@Args('input') input: CreateUserInput): User {
        const user: User = { id: this.users.length + 1, name: input.name };
        this.users.push(user);

        this.pubSub.publish('userCreated', { userCreated: user });
        return user;
    }

    @Subscription(() => User, {
        resolve: (value) => value.userCreated,
    })
    userCreated() {
        return this.pubSub.asyncIterableIterator('userCreated');
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

    @ResolveField(() => [Post])
    posts(@Parent() user: User, @Args('limit', { type: () => Int, nullable: true }) limit?: number) {
        return this.currentPosts.filter(p => p.authorId === user.id).slice(0, limit);
    }
}