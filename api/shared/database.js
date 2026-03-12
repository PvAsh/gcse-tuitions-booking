const { CosmosClient } = require('@azure/cosmos');

let client;
let database;
let containers = {};

async function getContainer(containerName) {
  if (containers[containerName]) return containers[containerName];

  if (!client) {
    client = new CosmosClient({
      endpoint: process.env.COSMOS_ENDPOINT,
      key: process.env.COSMOS_KEY,
    });
  }

  if (!database) {
    const { database: db } = await client.databases.createIfNotExists({
      id: process.env.COSMOS_DATABASE || 'gcse-tuitions',
    });
    database = db;
  }

  const { container } = await database.containers.createIfNotExists({
    id: containerName,
    partitionKey: { paths: ['/partitionKey'] },
  });

  containers[containerName] = container;
  return container;
}

module.exports = { getContainer };
