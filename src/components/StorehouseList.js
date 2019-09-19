import React, { useContext } from'react';
import { graphqlOperation } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';
import { listStorehouses } from '../graphql/queries';
import { onCreateStorehouse } from '../graphql/subscriptions';
import { Loading, Card, Tag } from "element-react";
import { Link } from 'react-router-dom';
import Error from './Error';
import { UserContext } from '../App';

const StorehouseList = () => {
  const user = useContext(UserContext);
  const onNewStorehouse = (prevQuery, newData) => {
    // shallow copy
    let updatedQuery = { ...prevQuery }
    const updatedStorehouseList = [
      newData.onCreateStorehouse,
      ...prevQuery.listStorehouses.items
    ];

    updatedQuery.listStorehouses.items = updatedStorehouseList;
    
    return updatedQuery;
  }
  return (
    <Connect
      query={graphqlOperation(listStorehouses)}
      subscription={graphqlOperation(onCreateStorehouse, { owner: user.username })}
      onSubscriptionMsg={onNewStorehouse}
    >
      {({ data, loading, errors }) => {
        if (errors.length > 0) return <Error errors={errors} />
        if (loading || !data.listStorehouses) return <Loading fullscreen={true} />

        return (
          <>
            <h2 className='header'>
              <img src='https://icon.now.sh/store_mall_directory/527FFF' alt='Store Icon' className='large-icon' />
              倉庫一覧
            </h2>
            {data.listStorehouses.items.map(storehouse => (
              <div key={storehouse.id} className='my-2'>
                <Card
                  bodyStyle={{
                    padding: '0.7em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span className='flex'>
                      <Link className='link' to={`/storehouses/${storehouse.id}`}>
                        {storehouse.name}
                      </Link>
                      <span style={{ color: 'var(--darkAmazonOrange)' }}>
                        {storehouse.products.length}
                      </span>
                      <img src='https://icon.now.sh/store_mall_directory' alt='Shopping Cart' />
                    </span>
                    <div style={{ color: 'var(--lightSquidInk)' }}>
                      {storehouse.owner}
                    </div>
                    <div>
                      {storehouse.tags && storehouse.tags.map(tag => (
                        <Tag key={tag} type='danger' className='mx-1'>
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </>
        )
      }}
    </Connect>
  )
};

export default StorehouseList;
