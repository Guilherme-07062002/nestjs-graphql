// tests/subscription.unit.ts (rodar com ts-node ou Jest + ts-jest)
import { PubSub } from 'graphql-subscriptions';
import { UserResolver } from '../resolver/user.resolver';

test('publish on createUser', async () => {
  const pubSub = new PubSub();
  const resolver = new UserResolver(pubSub);

  const it = pubSub.asyncIterableIterator('userCreated');
  const promise = it.next(); // aguarda o próximo publish

  resolver.createUser({ name: 'Ana' }); // chama mutation diretamente

  const result = await promise;
  expect(result.value.userCreated).toBeDefined();
  expect(result.value.userCreated.name).toBe('Ana');
});