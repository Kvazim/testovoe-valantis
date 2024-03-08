import React, { useState, useEffect } from 'react';
import { createAPI } from './services/api';

const Loaded = () => {
    return <div>Loading........</div>;
}

const App = () => {
    const [products, setProducts] = useState([]);
    // const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const getProducts = async () => {
        const api = createAPI();

        try {
            const response = await api.post('', {action: 'get_ids'});
            const fullProducts = new Set();
            response.data.result.forEach((id) => fullProducts.add(id));

            return Array.from(fullProducts.keys());
        } catch (error) {
            throw new Error(error);
        }
    }

    const getCurrentProducts = async (currentProducts) => {
        const api = createAPI();

        try {
            const response = await api.post('', {action: 'get_items', params: {ids: currentProducts}});
            const fullProducts = new Set();
            response.data.result.forEach((product) => fullProducts.add(product.id, product));
            console.log(Array.from(fullProducts.values()))
            // return Array.from(fullProducts.values());
            return fullProducts.values();
        } catch (error) {
            throw new Error(error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const allProducts = await getProducts();
            const filteredProducts = allProducts.slice((page - 1) * 50, page * 50)
            const currentProducts = await getCurrentProducts(filteredProducts)
            setProducts(currentProducts);
            setIsLoading(false);
        }

        fetchData();
    },[])
    console.log(products);

    const handleSearchChange = (event) => {
        // setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        // handleFilter();
    };

    if(isLoading) {
        return <Loaded />
    }

    return (
        <div>
            <h1>Product List</h1>
            <form onSubmit={handleSearchSubmit}>
                <input type="text" value={searchTerm} onChange={handleSearchChange} />
                <button type="submit">Search</button>
            </form>
            {
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
            }
        </div>
    );
};

export default App;
