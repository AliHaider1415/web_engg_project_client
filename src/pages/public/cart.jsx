import React from 'react';
import { Table, InputNumber, Button, Typography, Divider, message } from 'antd';
import '../../css/cart.css';
import { getCart, removeFromCart } from '../../services/cart';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const { Title, Text } = Typography;

export default function Cart() {
  const queryClient = useQueryClient();

  // Use React Query to fetch user cart data
  const { data: userCart, isLoading, isError, error } = useQuery({
    queryKey: ['userCart'],
    queryFn: getCart,
  });

  // Mutation for removing an item from the cart
  const { mutate: deleteItem, isLoading: isDeleting } = useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      // Invalidate the userCart query to refetch the updated cart data
      queryClient.invalidateQueries(['userCart']);
      message.success('Item removed from cart');
    },
    onError: (err) => {
      message.error(`Error removing item: ${err.message}`);
    },
  });

  // Handle quantity change
  const handleQuantityChange = (value, record) => {
    console.log(`Updated quantity for ${record.product.name}:`, value);
    // You can implement update logic here, like calling an API to update the cart item
  };

  // Columns definition for the cart table
  const columns = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (product) => product.name, // Accessing product name
    },
    {
      title: 'Price',
      dataIndex: 'product',
      key: 'price',
      render: (product) => `$${parseFloat(product.price).toFixed(2)}`, // Parsing price to float and formatting
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <InputNumber
          min={1}
          defaultValue={quantity}
          onChange={(value) => handleQuantityChange(value, record)}
        />
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total_price',
      key: 'total',
      render: (total_price) => `$${total_price.toFixed(2)}`, // Formatting total price
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          danger
          onClick={() => deleteItem(record.id)} // Call the delete function
          loading={isDeleting}
        >
          Remove
        </Button>
      ),
    },
  ];

  // Calculate total cart value
  const calculateTotal = () =>
    userCart ? userCart.items.reduce((acc, item) => acc + item.total_price, 0).toFixed(2) : 0;

  // Handle loading state
  if (isLoading) {
    return <div>Loading cart...</div>;
  }

  // Handle error state
  if (isError) {
    message.error(`Error fetching cart: ${error.message}`);
    return <div>Error fetching cart data</div>;
  }

  return (
    <div className="cart-container">
      <Title level={2} className="cart-title">
        Shopping Cart
      </Title>
      <Divider />
      {/* Display the cart table only if cart data exists */}
      <Table
        dataSource={userCart.items} // Updated to access 'items' from the API response
        columns={columns}
        pagination={false}
        className="cart-table"
        rowKey="id" // Make sure each item has a unique "id"
      />
      <Divider />
      <div className="cart-summary">
        <Text strong className="cart-summary-text">
          Total: ${calculateTotal()}
        </Text>
        <Button type="primary" size="large" className="checkout-button">
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}
