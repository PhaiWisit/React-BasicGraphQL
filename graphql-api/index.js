const { ApolloServer, gql } = require('apollo-server');

async function main() {
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'graphqltest' });


    const typeDefs = gql`
  type Attraction {
    id: Int
    name: String
    detail: String
    coverimage: String
    latitude: Float
    longitude: Float
  }
  type Query {
    attractions: [Attraction]
    attraction(id: Int!): Attraction
  }
`;
    const resolvers = {
        Query: {
            attractions: async () => {
                const [rows, fields] = await connection.execute('SELECT * FROM attractions');
                return rows;
            },
            attraction: async (parant,{ id }) => {
                const [rows, fields] = await connection.execute('SELECT * FROM attractions WHERE id=?', [id]);
                if (rows.length > 0) {
                    return rows[0];
                } else {
                    return;
                }
            }
        },
    };

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        csrfPrevention: true,
        cache: 'bounded',
    });

    server.listen().then(({ url }) => {
        console.log(`🚀  Server ready at ${url}`);
    });
}


main();


