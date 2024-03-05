import React, { useState, useEffect } from 'react';
import axios from 'axios';
import md5 from 'md5'

const API_URL = 'https://api.valantis.store:41000/';
const PASSWORD = 'Valantis';

const App = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    console.log(page);
    console.log(totalPages);

    useEffect(() => {
        fetchProducts();
    }, []);

    console.log(products);

    function getCurrentUTCDateWithoutDelimiter() {
      const now = new Date();
      const year = now.getUTCFullYear();
      let month = now.getUTCMonth() + 1;
      month = month < 10 ? '0' + month : month;
      let day = now.getUTCDate();
      day = day < 10 ? '0' + day : day;
      return `${year}${month}${day}`;
    }
  

  const fetchProducts = async () => {
      try {
          const timestamp = getCurrentUTCDateWithoutDelimiter();
          const authString = md5(`${PASSWORD}_${timestamp}`);
          const response = await axios.post(API_URL, {
              action: 'get_ids',
              // params: { offset: (page - 1) * 50, limit: 50 }
          }, {
              headers: {
                  'X-Auth': authString
              }
          });

          const ids = response.data.result;
          setTotalPages(ids.length)
          const detailedProducts = await getDetailedProducts(ids);
          setProducts(detailedProducts);
      } catch (error) {
          console.error('Error fetching products:', error);
      }
  };

    const getDetailedProducts = async (ids) => {
        const timestamp = getCurrentUTCDateWithoutDelimiter();
        const authString = md5(`${PASSWORD}_${timestamp}`);
        const response = await axios.post(API_URL, {
            action: 'get_items',
            params: { ids }
        }, {
            headers: {
                'X-Auth': authString
            }
        });
        return response.data.result;
    };

    const handleFilter = async () => {
        const timestamp = getCurrentUTCDateWithoutDelimiter();
        const authString = md5(`${PASSWORD}_${timestamp}`);
        const response = await axios.post(API_URL, {
            action: 'filter',
            params: { productName: searchTerm }
        }, {
            headers: {
                'X-Auth': authString
            }
        });
       
        const filteredIds = response.data.result;
        const detailedFilteredProducts = await getDetailedProducts(filteredIds);
        setFilteredProducts(detailedFilteredProducts);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        handleFilter();
    };

    return (
        <div>
            <h1>Product List</h1>
            <form onSubmit={handleSearchSubmit}>
                <input type="text" value={searchTerm} onChange={handleSearchChange} />
                <button type="submit">Search</button>
            </form>
            {filteredProducts.length > 0 ? (
                <ul>
                    {filteredProducts.map(product => (
                        <li key={product.id}>
                            {product.product} - {product.price}$
                        </li>
                    ))}
                </ul>
            ) : (
                <ul>
                    {products.map(product => (
                        <li style={{marginBottom: '30px'}} key={product.id}>
                          {product.id && <div style={{marginBottom: '15px'}}>ID: <div>{product.id}</div></div>}
                          {product.product && <div style={{marginBottom: '15px'}}>PRODUCT: <div>{product.product}</div></div>}
                          {product.brand && <div style={{marginBottom: '15px'}}>BRAND: <div>{product.brand}</div></div>}
                          {product.price && <div>PRICE: {product.price}$</div>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default App;
