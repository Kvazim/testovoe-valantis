import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getAuhToken } from './utils/common';
import { BaseURL } from './const';
import { getToken, saveToken } from './services/token';

const App = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        saveToken(getAuhToken());
    }, [])

    const retryGetDetailedProducts = useCallback(async (ids) => {
        try {
            const response = await axios.post(BaseURL.Secondary, {
                action: 'get_items',
                params: { ids }
            }, {
                headers: {
                    'X-Auth': getToken()
                }
            });
            return response.data.result;
        } catch (error) {
            console.error('Error fetching detailed products from backup API:', error);
        }
    }, []);

    const getDetailedProducts = useCallback(async (ids) => {
        try {
            const response = await axios.post(BaseURL.Primary, {
                action: 'get_items',
                params: { ids }
            }, {
                headers: {
                    'X-Auth': getToken()
                }
            });
            return response.data.result;
        } catch (error) {
            console.error('Error fetching detailed products:', error);
            retryGetDetailedProducts(ids);
        }
    }, [retryGetDetailedProducts]);

    const retryFetchProducts = useCallback(async () => {
        try {
            const response = await axios.post(BaseURL.Secondary, {
                action: 'get_ids',
                params: { offset: (page - 1) * 50, limit: 50 }
            }, {
                headers: {
                    'X-Auth': getToken()
                }
            });
            const ids = response.data.result;
            const detailedProducts = await getDetailedProducts(ids);
            setProducts(detailedProducts);
        } catch (error) {
            console.error('Error fetching products from backup API:', error);
        }
    }, [getDetailedProducts, page]);

    const fetchProducts = useCallback(async () => {
        try {
            const response = await axios.post(BaseURL.Primary, {
                action: 'get_ids',
                params: { offset: (page - 1) * 50, limit: 50 }
            }, {
                headers: {
                    'X-Auth': getToken()
                }
            });
            const ids = response.data.result;
            const detailedProducts = await getDetailedProducts(ids);
            setProducts(detailedProducts);
        } catch (error) {
            console.log(error.status)
            console.log(error.text)
            console.error('Error fetching products:', error);
            retryFetchProducts();
        }
    },[getDetailedProducts, page, retryFetchProducts]);


    const handleFilter = async () => {
        try {
            const response = await axios.post(BaseURL.Primary, {
                action: 'filter',
                params: { productName: searchTerm }
            }, {
                headers: {
                    'X-Auth': getToken()
                }
            });

            const filteredIds = response.data.result;
            const detailedFilteredProducts = await getDetailedProducts(filteredIds);
            setFilteredProducts(detailedFilteredProducts);
        } catch (error) {
            console.error('Error filtering products:', error);
            retryFilter();
        }
    };

    const retryFilter = async () => {
        try {
            const response = await axios.post(BaseURL.Secondary, {
                action: 'filter',
                params: { productName: searchTerm }
            }, {
                headers: {
                    'X-Auth': getToken()
                }
            });

            const filteredIds = response.data.result;
            const detailedFilteredProducts = await getDetailedProducts(filteredIds);
            setFilteredProducts(detailedFilteredProducts);
        } catch (error) {
            console.error('Error filtering products from backup API:', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        handleFilter();
    };

    useEffect(() => {
        console.log(getToken())
        if (getToken) {
            fetchProducts();
        }
    }, [fetchProducts, page]);

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
                        <li key={product.id}>
                            {product.product} - {product.price}$
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default App;
