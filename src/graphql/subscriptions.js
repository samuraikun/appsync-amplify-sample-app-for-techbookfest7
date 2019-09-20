/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateStorehouse = `subscription OnCreateStorehouse($owner: String!) {
  onCreateStorehouse(owner: $owner) {
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
export const onUpdateStorehouse = `subscription OnUpdateStorehouse($owner: String!) {
  onUpdateStorehouse(owner: $owner) {
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
export const onDeleteStorehouse = `subscription OnDeleteStorehouse($owner: String!) {
  onDeleteStorehouse(owner: $owner) {
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
export const onCreateProduct = `subscription OnCreateProduct($owner: String!) {
  onCreateProduct(owner: $owner) {
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
export const onUpdateProduct = `subscription OnUpdateProduct($owner: String!) {
  onUpdateProduct(owner: $owner) {
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
export const onDeleteProduct = `subscription OnDeleteProduct($owner: String!) {
  onDeleteProduct(owner: $owner) {
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
