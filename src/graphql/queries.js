/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getStorehouse = `query GetStorehouse($id: ID!) {
  getStorehouse(id: $id) {
    id
    name
    products {
      items {
        id
        description
        price
        owner
        createdAt
      }
      nextToken
    }
    tags
    owner
    createdAt
  }
}
`;
export const listStorehouses = `query ListStorehouses(
  $filter: ModelStorehouseFilterInput
  $limit: Int
  $nextToken: String
) {
  listStorehouses(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      products {
        nextToken
      }
      tags
      owner
      createdAt
    }
    nextToken
  }
}
`;
export const getProduct = `query GetProduct($id: ID!) {
  getProduct(id: $id) {
    id
    description
    storehouse {
      id
      name
      products {
        nextToken
      }
      tags
      owner
      createdAt
    }
    file {
      bucket
      region
      key
    }
    price
    owner
    createdAt
  }
}
`;
export const listProducts = `query ListProducts(
  $filter: ModelProductFilterInput
  $limit: Int
  $nextToken: String
) {
  listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      description
      storehouse {
        id
        name
        tags
        owner
        createdAt
      }
      file {
        bucket
        region
        key
      }
      price
      owner
      createdAt
    }
    nextToken
  }
}
`;
export const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    username
    email
    registered
  }
}
`;
export const searchStorehouses = `query SearchStorehouses(
  $filter: SearchableStorehouseFilterInput
  $sort: SearchableStorehouseSortInput
  $limit: Int
  $nextToken: String
) {
  searchStorehouses(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      name
      products {
        nextToken
      }
      tags
      owner
      createdAt
    }
    nextToken
  }
}
`;
