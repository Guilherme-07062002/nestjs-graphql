import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Date', () => Date) // Define o nome no Schema ('Date') e o tipo mapeado
export class DateScalar implements CustomScalar<string, Date> {
  description = 'Scalar customizado para datas (formato ISO 8601)';

  /**
   * 1. DO SERVER PRO CLIENTE (Output)
   * O banco te devolve um objeto Date(). O JSON não suporta objetos.
   * Você precisa transformar em string (ISO) para enviar via HTTP.
   */
  serialize(value: unknown): string {
    if (value instanceof Date) {
        const day = value.getDate().toString().padStart(2, '0');
        const month = (value.getMonth() + 1).toString().padStart(2, '0'); // Mês começa em 0
        const year = value.getFullYear();

        return `${day}/${month}/${year}`;
    }
    throw new Error('GraphQL Date Scalar serializer expected a `Date` object');
  }

  /**
   * 2. DO CLIENTE PRO SERVER (Input Variables)
   * O frontend manda um JSON: { "birthDate": "2023-10-05..." }
   * Você recebe uma string e quer transformar num objeto Date para usar no Service.
   */
  parseValue(value: unknown): Date {
    if (typeof value === 'string' || typeof value === 'number') {
      return new Date(value); // Transforma string/timestamp em objeto Date
    }
    throw new Error('GraphQL Date Scalar parser expected a `number` or `string`');
  }

  /**
   * 3. DO CLIENTE PRO SERVER (Hardcoded na Query - AST)
   * Ocorre quando o dev escreve a string direto na query, sem usar variáveis ($input).
   * Ex: mutation { create(date: "2023-10-05") }
   */
  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    return null;
  }
}