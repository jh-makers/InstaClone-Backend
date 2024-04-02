import { PrismaClient } from "@prisma/client";
import { ApolloServer, gql } from "apollo-server";

const client = new PrismaClient();

// Prisma 와 GraphQL로 작업할 때 typeDefs 와 Prisma의 Schema 비교하면서 신경써야함 다르면 오류 발생
// GraphQL 문법과 Prisma의 문법의 차이는 Prisma의 경우 모든 것들이 기본적으로 required다 그래서 아닌 경우에는 ?를 붙여서 필수가 아니라 해줘야한다.
// 반대로 GraphQLdml 경우에는 모든게 선택이다. !는 필수로 필요하다라는 뜻
const typeDefs = gql`
  type Movie {
    id: Int!
    title: String!
    year: Int!
    genre: String
    createdAt: String!
    updatedAt: String!
  }
  type Query {
    movies: [Movie]
    movie(id: Int!): Movie
  }
  type Mutation {
    createMovie(title: String!, year: Int!, genre: String): Movie
    deleteMovie(id: Int!): Movie
    updateMovie(id: Int!, year: Int!): Movie
  }
`;

const resolvers = {
  Query: {
    // 데이터 베이스에 접근해서 모든 영화들을 검색
    movies: () => client.movie.findMany(),
    movie: (_, { id }) => client.movie.findUnique({ where: { id } }),
  }, // where: {id : id} 랑 같음
  Mutation: {
    createMovie: (_, { title, year, genre }) =>
      client.movie.create({
        data: {
          title,
          year,
          genre,
        },
      }),
    deleteMovie: (_, { id }) => client.movie.delete({ where: { id } }),
    updateMovie: (_, { id, year }) =>
      client.movie.update({ where: { id }, data: { year } }),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server
  .listen()
  .then(() => console.log("Server is running on http://localhost:4000/"));
