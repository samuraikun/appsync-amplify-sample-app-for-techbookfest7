import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { Loading, Tabs, Icon } from 'element-react';
import { Link } from 'react-router-dom';
import NewProduct from '../components/NewProduct';
import Product from '../components/Product';

// override getStorehouse query
const getStorehouse = `query GetStorehouse($id: ID!) {
  getStorehouse(id: $id) {
    id
    name
    products {
      items {
        id
        description
        price
        shipped
        owner
        file {
          key
        }
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

function StorehousePage({ storehouseId }) {
  const [storehouse, setStorehouse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function handleGetStorehouse() {
      const input = { id: storehouseId };
      const result = await API.graphql(graphqlOperation(getStorehouse, input));

      setStorehouse(result.data.getStorehouse);
      setIsLoading(false);
    }

    handleGetStorehouse()
  }, [storehouseId]);

  return isLoading ? (
    <Loading fullscreen={true} />
  ) : (
    <>
      {/* Back Button */}
      <Link className='link' to=''>
        倉庫一覧へ戻る
      </Link>

      {/* Storehouse MetaData */}
      <span className='items-center pt-2'>
        <h2 className='mb-mr'>{storehouse.name}</h2>- {storehouse.owner}
      </span>
      <div className='items-center pt-2'>
        <span style={{ color: 'var(--lightSquidInk)', paddingBottom: '1em' }}>
          <Icon name='date' className='icon' />
          {storehouse.createdAt}
        </span>
      </div>

      {/* New Product */}
      <Tabs type='border-card' value='1'>
        <Tabs.Pane
          label={
            <>
              <Icon name='plus' className='icon' />
              製品を追加
            </>
          }
          name='1'
        >
          <NewProduct storehouseId={storehouseId} />
        </Tabs.Pane>
        {/* Products List */}
        <Tabs.Pane
          label={
            <>
              <Icon name='menu' className='icon' />
              Products ({ storehouse.products.items.length })
            </>
          }
          name='2'
        >
          <div className='product-list'>
            {storehouse.products.items.map(product => (
              <Product key={product.id} product={product} />
            ))}
          </div>
        </Tabs.Pane>
      </Tabs>
    </>
  )
}

export default StorehousePage;
