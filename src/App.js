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

    const getProduct = async () => {
        const api = createAPI('get_ids');
        console.log(api.toString())
        try {
            const response = await api.post();
            return response;
        } catch (error) {
            throw new Error(error);
        }
    }

    useEffect(() => {
        setProducts(getProduct());
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
