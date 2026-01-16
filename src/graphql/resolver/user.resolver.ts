import { Resolver, Query, ObjectType, Field, Int } from "@nestjs/graphql";

// Definição do tipo User para o GraphQL
@ObjectType()
class User {
    @Field(() => Int)
    id: number;
    
    @Field()
    name: string;
}

// Um resolver é um conjunto de queries, mutations e subscriptions que tratam de um determinado tipo ou funcionalidade
@Resolver(() => User)
export class UserResolver {
    // Exemplo de query simples que retorna uma lista de usuários
    @Query(() => [User])
    users(): User[] {
        return [
            { id: 1, name: 'John Doe' },
            { id: 2, name: 'Jane Smith' },
        ];
    }
}