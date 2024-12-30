import React from 'react';
import { Card, Button, Rate } from 'antd';
import { Link } from 'react-router-dom'; // Import Link for navigation
import '../css/product-card.css'; // Import external CSS

const { Meta } = Card;

export default function ProductCard({ id, title, img, price, rating, handleAddToCart }) {

  const handleButtonClick = (e) => {
    // Stop the event from propagating to the Link component
    e.stopPropagation();
    handleAddToCart(); // Call the passed handleAddToCart function
  };

  return (
    <Card
      hoverable
      style={{
        width: 350,
        position: 'relative', // Positioning for the hover effect div
      }}
      cover={<img alt="example" src={img} />}
    >
      <Meta
        title={title}
        description={
          <div>
            <div className="product-price">Rs {price}</div>
            <div className="product-ratings">
              <Rate allowHalf defaultValue={rating} />
            </div>
          </div>
        }
      />
      <Button className="add-to-cart-btn" type="primary" block onClick={handleButtonClick}>
        Add to Cart
      </Button>

      {/* Hover Effect */}
      <div className="hover-detail">
        <Link to={`/product/detail/${id}`} className="show-detail-link">
          Show Detail
        </Link>
      </div>
    </Card>
  );
}
