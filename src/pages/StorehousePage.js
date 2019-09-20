import React, { useEffect, useReducer, useContext } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { Loading, Tabs, Icon } from 'element-react';
import { Link } from 'react-router-dom';
import { onCreateProduct, onUpdateProduct, onDeleteProduct } from '../graphql/subscriptions';
import { UserContext } from '../App';
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

const initialState = {
  storehouse: null,
  isLoading: true
};

function reducer(state, action) {
  switch(action.type) {
    case 'fetchStorehouse':
      return {
        ...state, storehouse: action.storehouse, isLoading: false
      }
    case 'createProductSubscription':
      const createdProduct = action.productData.value.data.onCreateProduct;
      const prevProducts = state.storehouse.products.items.filter(item => item.id !== createdProduct.id);
      const updatedProductsByCreateSubscription = [createdProduct, ...prevProducts];

      // shallow copy storehouse object
      const newStorehouseByCreateSubscription = { ...state.storehouse };
      newStorehouseByCreateSubscription.products.items = updatedProductsByCreateSubscription;

      return { ...state, storehouse: newStorehouseByCreateSubscription }
    case 'updateProductSubscription':
      const updatedProduct = action.productData.value.data.onUpdateProduct;
      const updatedProductIndex = state.storehouse.products.items.findIndex(item => item.id === updatedProduct.id);
      const updatedProductsByUpdateSubscription = [
        ...state.storehouse.products.items.slice(0, updatedProductIndex),
        updatedProduct,
        ...state.storehouse.products.items.slice(updatedProductIndex + 1)
      ];

      // shallow copy storehouse object
      const newStorehouseByUpdateSubscription = { ...state.storehouse };
      newStorehouseByUpdateSubscription.products.items = updatedProductsByUpdateSubscription;

      return {  ...state, storehouse: newStorehouseByUpdateSubscription }
    case 'deleteProductSubscription':
      const deletedProduct = action.productData.value.data.onDeleteProduct;
      const updatedProductsByDeleteSubscription = state.storehouse.products.items.filter(item => item.id !== deletedProduct.id);

      // shallow copy storehouse object
      const newStorehouseByDeleteSubscription = { ...state.storehouse };
      newStorehouseByDeleteSubscription.products.items = updatedProductsByDeleteSubscription;

      return { ...state, storehouse: newStorehouseByDeleteSubscription }
    default:
      throw new Error();
  }
}

function StorehousePage({ storehouseId }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { storehouse, isLoading } = state;
  const user = useContext(UserContext);

  useEffect(() => {
    async function handleGetStorehouse() {
      const input = { id: storehouseId };
      const result = await API.graphql(graphqlOperation(getStorehouse, input));

      dispatch({
        type: 'fetchStorehouse',
        storehouse: result.data.getStorehouse
      })
    }

    handleGetStorehouse()
  }, [storehouseId]);

  useEffect(() => {
    const createProductListener = API.graphql(graphqlOperation(onCreateProduct, { owner: user.username }))
      .subscribe({
        next: productData => {
          dispatch({
            type: 'createProductSubscription',
            productData
          });
        }
      });

    const updateProductListener = API.graphql(graphqlOperation(onUpdateProduct, { owner: user.username }))
      .subscribe({
        next: productData => {
          dispatch({
            type: 'updateProductSubscription',
            productData
          });
        }
      });

    const deleteProductListener = API.graphql(graphqlOperation(onDeleteProduct, { owner: user.username }))
      .subscribe({
        next: productData => {
          dispatch({
            type: 'deleteProductSubscription',
            productData
          });
        }
      });

    return () => {
      createProductListener.unsubscribe();
      updateProductListener.unsubscribe();
      deleteProductListener.unsubscribe();
    }
  }, [storehouse, user.username]);

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
