import React, { useState, useEffect } from 'react';
import { createAPI } from './services/api';
import { MAX_PRODUCT_PER_PAGE } from './const';
import { Container, Pagination, Stack} from '@mui/material';

const Loaded = () => {
    return <div>Loading........</div>;
}

const App = () => {
    const [products, setProducts] = useState([]);
    // const [filteredProducts, setFilteredProducts] = useState([]);
    // const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [pageQty, setPageQty] = useState(0);
    // const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const getProductsId = async (postParams = null) => {
        const api = createAPI();

        try {
            const response = await api.post('', {action: 'get_ids', ...postParams});
            const fullProducts = new Set();

            response.data.result.forEach((id) => {
                fullProducts.add(id)
            });

            return Array.from(fullProducts.keys());
        } catch (error) {
            throw new Error(error);
        }
    }

    const getCurrentProducts = async (currentProducts) => {
        const api = createAPI();

        try {
            const response = await api.post('', { action: 'get_items', params: { ids: currentProducts } });
            const filteredProducts = new Map();
            response.data.result.forEach((product) => {
                if (!filteredProducts.has(product.id)) {
                    filteredProducts.set(product.id, product);
                }
            });
    
            return Array.from(filteredProducts.values());
        } catch (error) {
            throw new Error(error);
        }
    }

    useEffect(() => {
        const getAllProducts = async () => {
            const allProducts = await getProductsId();
            setPageQty(Math.ceil(allProducts.length / MAX_PRODUCT_PER_PAGE))
        } 
        
        getAllProducts();
    },[])

    useEffect(() => {
        setIsLoading(true);

        const getLimitedProducts = async () => {
            const limitedProducts = await getProductsId({params: { offset: (page - 1) * MAX_PRODUCT_PER_PAGE, limit: MAX_PRODUCT_PER_PAGE }});
            const paginatedProducts = await getCurrentProducts(limitedProducts)
            setProducts(paginatedProducts);
            setIsLoading(false);
        }

        getLimitedProducts();
    }, [page])
    // console.log(products);

    // const handleSearchChange = (event) => {
    //     // setSearchTerm(event.target.value);
    // };

    // const handleSearchSubmit = (event) => {
    //     event.preventDefault();
    //     // handleFilter();
    // };

    if(isLoading) {
        return <Loaded />
    }

    return (
        <div>
            <h1>Product List</h1>
            {products.length > 0 && (
                <ul style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px'}}>
                    {products.map(product => (
                        <li key={product.id}>
                            {product.id && (
                                <div style={{marginBottom: '15px'}}>
                                    ID: <span>{product.id}</span>
                                </div>
                            )}
                            {product.product && (
                                <div style={{marginBottom: '15px'}}>
                                    PRODUCT: <span>{product.product}</span>
                                </div>
                            )}
                            {product.brand && (
                                <div style={{marginBottom: '15px'}}>
                                    BRAND: <span>{product.brand}</span>
                                </div>
                            )}
                            {product.price && (
                                <div>
                                    PRICE: <span>{product.price}$</span>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            <Container sx={{marginTop: 5}}>
                <Stack spacing={2}>
                    {
                        !!pageQty && (
                            <Pagination
                                count={pageQty} 
                                page={page}
                                onChange={(_, num) => setPage(num) } 
                            />
                    )}
                </Stack>
            </Container>
            {/* <form onSubmit={handleSearchSubmit}>
                <input type="text" value={searchTerm} onChange={handleSearchChange} />
                <button type="submit">Search</button>
            </form> */}
            {/* {
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
            } */}
        </div>
    );
};

export default App;
