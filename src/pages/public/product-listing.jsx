import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Select, Checkbox, Button, Slider, Spin, Alert, message } from 'antd';
import ProductCard from '../../components/product-card';
import '../../css/product-listing.css';
import useUserStore from '../../store/user-store';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getUserProductList, getGuestProductList } from '../../services/product';
import { addToCart } from '../../services/cart';

const { Option } = Select;

export default function ProductListing() {
  const { user } = useUserStore();

  const [addingToCart, setAddingToCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSort, setSelectedSort] = useState('price');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products', selectedCategory, priceRange],
    queryFn: () => {
      if (user?.role === 'user') {
        return getUserProductList(selectedCategory);
      } else if (user?.role === 'guest') {
        return getGuestProductList(selectedCategory, priceRange[0], priceRange[1]);
      } else {
        throw new Error('Invalid user role');
      }
    },
    enabled: !!user,
  });


  const { mutate: addToCartMutation, isLoading: isAddingToCart, error: errorAddingToCart } = useMutation({
    mutationFn: addToCart, // Call the addToCart service
    onMutate: () => {
      // You can set any state here to show a loading spinner or indication
      setAddingToCart(true);
    },
    onSettled: () => {
      // Reset loading state when the mutation is finished
      setAddingToCart(false);
    },
    onSuccess: (data) => {
      // Show success message when product is added successfully
      message.success('Product added to cart successfully');
    },
    onError: (error) => {
      // Handle errors and show an error message
      message.error('Error while adding product to cart');
      console.error('Product to cart failed:', errorAddingToCart);
    },
  });


  useEffect(() => {
    if (products) {
      filterProducts(searchTerm, selectedCategory, selectedSort);
    }
  }, [products, searchTerm, selectedCategory, selectedSort]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (value) => {
    setSelectedSort(value);
  };

  const handleCategoryChange = (checkedValues) => {
    setSelectedCategory(checkedValues);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const filterProducts = (searchTerm, category, sortBy) => {
    if (!products) return;

    products.forEach((product) => {
      console.log("Product:", product);
      console.log("Matches Search:", product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase()));
      console.log("Matches Category:", category.length === 0 || category.includes(product.category?.name));
      console.log("Matches Price:", product.price >= priceRange[0] && product.price <= priceRange[1]);
    });
    

    let newFilteredProducts = products.filter((product) => {
      const matchesSearch =
        product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
        category.length === 0 || 
        category.some((cat) => cat.toLowerCase() === product.category?.toLowerCase());
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });

    console.log("products in filter: ", newFilteredProducts);

    sortProducts(newFilteredProducts, sortBy);
  };

  const sortProducts = (productsToSort, sortBy) => {
    let sortedProducts = [...productsToSort];
    if (sortBy === 'price') {
      sortedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === 'alphabet') {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
    setFilteredProducts(sortedProducts);
  };


  return (
    <div className="product-listing">
      <div className="custom-container">
        <div className="filters">
          <Input
            placeholder="Search Products"
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: 200, marginBottom: 16 }}
          />

          <div style={{ marginBottom: 16 }}>
            <Checkbox.Group
              options={['Electronics', 'Audio', 'Peripherals', 'Shoes']}
              value={selectedCategory}
              onChange={handleCategoryChange}
              style={{ display: 'flex', flexDirection: 'column' }}
            />
          </div>

          <Select
            defaultValue={selectedSort}
            onChange={handleSortChange}
            style={{ width: 200, marginBottom: 16 }}
          >
            <Option value="price">Sort by Price</Option>
            <Option value="alphabet">Sort by Alphabet</Option>
          </Select>

          <Slider
            range
            step={10}
            defaultValue={priceRange}
            onChange={handlePriceChange}
            style={{ width: 200, marginBottom: 16 }}
          />
        </div>

        <div className="products-right-section">

          <div className="right-header-section">

          <h1 className="title">Products</h1>

          {user?.role === 'user' && (
            <Button type="primary" href="/product/create" className="create-product-button">
              Add New Product
            </Button>
          )}

          </div>

          <div className="products-grid">
            {isLoading ? (
              <Spin size="large" />
            ) : error ? (
              <Alert message="Error loading products" type="error" />
            ) : (
              filteredProducts.map((product) => (
                <Col key={product.id} span={6}>
                  <ProductCard
                    id={product.id}
                    title={product.name}
                    img={product?.image ?? 'https://placehold.co/600x400?text=Hello\nProduct'} // Fallback for missing image
                    price={product.price}
                    rating={product.rating || 0} // Assuming rating might be null
                    handleAddToCart={() => {
                      addToCartMutation(product.id);
                    }}
                  />
                </Col>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
