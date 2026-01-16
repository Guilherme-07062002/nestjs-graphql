# NestJS + GraphQL — Exemplo

Este repositório contém um exemplo simples de API GraphQL construída com NestJS. O objetivo é demonstrar resolvers, tipos, validações, paginação opcional e subscriptions usando `graphql-subscriptions`.

Principais implementações:

- **Tipos GraphQL:** `User` e `Post` (definidos com `@ObjectType`).
- **Input Types:** `CreateUserInput`, `UpdateUserInput`, `PaginationArgs`.
- **Queries:**
	- `listUsers(pagination?)` — retorna lista de usuários; o argumento `pagination` é opcional. Quando ausente, usa valores padrão (`skip=0`, `take=10`).
	- `getUser(id)` — busca um usuário por `id`.
- **Mutations:** `createUser`, `updateUser`, `deleteUser`.
- **Subscription:** `userCreated` — publicada quando um novo usuário é criado (usa `PubSub`).
- **ResolveField:** `posts` — resolve os posts relacionados a um `User` (com opção de `limit`).
- **Validações:** `class-validator` (`@MinLength`) aplicado em campos como `name`, `title` e `content`.

Como executar:

1. Instale dependências: `pnpm install` (ou `npm install` / `yarn`).
2. Inicie a aplicação em modo desenvolvimento: `pnpm run start:dev`.
3. Acesse o GraphQL Playground/Playground em `http://localhost:3000/graphql` para testar queries, mutations e subscriptions.

Arquivo principal do resolver: [src/graphql/resolver/user.resolver.ts](src/graphql/resolver/user.resolver.ts#L1-L200)

