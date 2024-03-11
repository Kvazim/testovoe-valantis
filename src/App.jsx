import { useState, useEffect, useCallback } from 'react';
import { MAX_PRODUCT_PER_PAGE } from './const';
import { Container, Pagination, Stack} from '@mui/material';
import { getProducts } from './services/api-products';

function Loaded() {
  return <div>Loading........</div>;
}

const App = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageQty, setPageQty] = useState(0);
  const [differensProduct, setDifferensProduct] = useState(0);
  const [differensLimit, setDifferensLimit] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getAllProductsId = async () => {
    const allProducts = await getProducts('get_ids');
    const fullProducts = new Set();

    allProducts.forEach((id) => {
      fullProducts.add(id)
    });

    setPageQty(Math.ceil(Array.from(fullProducts.keys()).length / MAX_PRODUCT_PER_PAGE))
  }

  const getLimitedProducts = useCallback(async (currentPage) => {
    let getCurrentProducts = await getProducts('get_ids', {params: { offset: (currentPage - 1) * (MAX_PRODUCT_PER_PAGE + differensProduct), limit: MAX_PRODUCT_PER_PAGE + differensLimit }});

    const getCurrentProductsByid = await getProducts('get_items', {params: { ids: getCurrentProducts }});
    const filteredProducts = new Map();

    getCurrentProductsByid.forEach((product) => {
      if (!filteredProducts.has(product.id)) {
        filteredProducts.set(product.id, product);
      }
    });

    const optimizedProducts = Array.from(filteredProducts.values())

    if (optimizedProducts.length < MAX_PRODUCT_PER_PAGE) {
      const differensProduct = MAX_PRODUCT_PER_PAGE - optimizedProducts.length;
      setDifferensProduct((prev) => prev + differensProduct);
      setDifferensLimit((prev) => prev + differensProduct);
      return;
    }

    setDifferensLimit(0);
    setProducts(optimizedProducts);
  }, [differensLimit, differensProduct]);

  const getFilteredProducts = async (searchType, value) => {
    const filteredProducts = await getProducts('filter', {params: {[searchType]: value}});
    console.log(filteredProducts);
  }

  useEffect(() => {
    getAllProductsId();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getLimitedProducts(page).finally(() => setIsLoading(false));
  }, [getLimitedProducts, page]);


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();

        if (Number.isFinite(Number(searchTerm))) {
          return getFilteredProducts('price', Number(searchTerm));
        }
    };

  if(isLoading) {
    return <Loaded />
  }

  return (
    <>
      <h1>Product List</h1>
      <div>{products.length}</div>
        <form onSubmit={handleSearchSubmit}>
          <input type="text" value={searchTerm} id='search-input' name='search-input' onChange={handleSearchChange} />
          <button type="submit">Search</button>
        </form>
      {products.length > 0 && (
        <ul style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr', rowGap: '25px', columnGap: '50px'}}>
          {products.map((product) => (
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
            )
          }
        </Stack>
      </Container>
    </>
  );
};

export default App;
