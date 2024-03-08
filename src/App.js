import React, { useState, useEffect } from 'react';
import { createAPI } from './services/api';

const Loaded = () => {
    return <div>Loading........</div>;
}

const App = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const getProducts = async () => {
        const api = createAPI();

        try {
            const response = await api.post('',{action: 'get_ids', params: null });
            const fullProducts = new Set();
            response.data.result.forEach((id) => fullProducts.add(id));

            return Array.from(fullProducts.keys());
        } catch (error) {
            throw new Error(error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const allProducts = await getProducts();
            setProducts(allProducts);
            setIsLoading(false);
        }

        fetchData();
        // const getAllProduct = getProducts();
        // setProducts(getProduct());
        console.log(products);
        setIsLoading(false);
    },[])


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
            {/* {filteredProducts.length > 0 ? (
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
            )} */}
        </div>
    );
};

export default App;
