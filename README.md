# Nu GTX API

[![Coverage Status](https://coveralls.io/repos/github/GabrielFreitasP/nu-gtx-api/badge.svg)](https://coveralls.io/github/GabrielFreitasP/nu-gtx-api)

Uma API RESTful construída com Node.js, TypeScript, Nest.js, TypeORM, PostgreSQL, Docker, Docker Compose, Swagger e Jest.

## Pré-requisitos

Certifique-se de ter o Docker e o Docker Compose instalados na sua máquina.

## Instalação

Clone o repositório:

```bash
git clone https://github.com/GabrielFreitasP/nu-gtx-api
```

Acesse o diretório do projeto:

```bash
cd nu-gtx-api
```

Execute o Docker Compose para construir os containers:

```bash
docker-compose up --build
```

## Configuração

Para configurar o banco de dados PostgreSQL, verifique o arquivo `ormconfig.ts`.

## Uso

Após iniciar os containers, a API estará disponível em `http://localhost:3000`.

### Documentação

Acesse a documentação Swagger em `http://localhost:3000/api/docs`.

### Testes

Execute os testes Jest:

```bash
docker-compose exec app npm test
```

## Endpoints

A API oferece os seguintes endpoints:

- `GET /users`: Obter todos os usuários.
- `GET /users/:id`: Obter um usuário específico.
- `POST /users`: Criar um novo usuário.
- `PUT /users/:id`: Atualizar os dados de um usuário.
- `DELETE /users/:id`: Excluir um usuário.

(Adicione endpoints adicionais conforme necessário para outras entidades, como produtores, pedidos, etc.)

## Contribuição

Contribuições são bem-vindas! Abra uma issue ou envie uma solicitação de pull.

## Licença

Este projeto está licenciado sob a [Apache License 2.0](LICENSE).
