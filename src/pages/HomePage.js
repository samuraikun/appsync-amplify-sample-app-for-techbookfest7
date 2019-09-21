import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { searchStorehouses } from '../graphql/queries';
import NewStorehouse from '../components/NewStorehouse';
import StorehouseList from '../components/StorehouseList';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchChange = searchTerm => setSearchTerm(searchTerm);
  const handleClearSearch = () => setSearchTerm('') && setSearchResults([]);
  const handleSearch = async event => {
    try {
      event.preventDefault();
      setIsSearching(true);
      const result = await API.graphql(
        graphqlOperation(searchStorehouses, {
          limit: 10,
          filter: {
            or: [
              { name: { match: searchTerm }},
              { owner: { match: searchTerm }},
              { tags: { match: searchTerm } }
            ]
          },
          sort: {
            field: 'createdAt',
            direction: 'desc'
          }
        })
      );

      console.log(result);
      setSearchResults(result.data.searchMarkets.items);
      setIsSearching(false);
    }
    catch (err) {
      console.error(err);
      setIsSearching(false);
    }
  }
  
  return (
    <>
      <NewStorehouse
        search={searchTerm}
        isSearching={isSearching}
        handleSearchChange={handleSearchChange}
        handleClearSearch={handleClearSearch}
        handleSearch={handleSearch}
      />
      <StorehouseList searchResults={searchResults} />
    </>
  )
}
