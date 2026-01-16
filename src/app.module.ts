import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserResolver } from './graphql/resolver/user.resolver';
import { PubSub } from 'graphql-subscriptions';
import { DateScalar } from './graphql/common/scalars/date.scalar';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
  ],
  providers: [UserResolver, PubSub, DateScalar],
})
export class AppModule {}
