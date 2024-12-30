import {React, useState} from 'react';
import { Row, Col, Card, Button, Typography,Spin, Alert, message, Modal, Input, Select, Upload } from 'antd';
import '../../css/dashboard.css';
import { UserOutlined, LockOutlined, FileImageOutlined } from '@ant-design/icons';
import { createBlogValidationSchema } from '../../schema/schema';
import { Formik, Field, Form as FormikForm } from 'formik';
import ProductCard from '../../components/product-card';
import useUserStore from '../../store/user-store';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { getUserProductList, getGuestProductList } from '../../services/product';
import { getUserBlogList, getGuestBlogList, getBlogDetail, deleteBlog } from '../../services/blog';
import { addToCart } from '../../services/cart';
import BlogCard from '../../components/blog-card';


const { Title, Paragraph } = Typography;
const { Option } = Select;
export default function Dashboard() {

const queryClient = useQueryClient();
const {user} = useUserStore();

const [selectedBlog, setSelectedBlog] = useState({
    id: null
  });

  const [addingToCart, setAddingToCart] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => {
        if (user?.role === 'user') {
        return getUserProductList();
        } else if (user?.role === 'guest') {
        return getGuestProductList();
        } else {
        throw new Error('Invalid user role');
        }
    },
    enabled: !!user,
    });


    const { data: userBlogList, isLoading: loadingUserBlogList } = useQuery({
        queryKey: ['userBlogList'], // Include user.role to refetch when it changes
        queryFn: () => {
          if (user.role === 'user') {
            return getUserBlogList();
          } else if (user.role === 'guest') {
            return getGuestBlogList();
          } else {
            throw new Error('Invalid user role');
          }
        },
        enabled: !!user, // Ensure the query only runs when the user object is available
      });



      const { data: blogDetail, loading: loadingBlogDetail } = useQuery({
        queryKey: ['blogDetail', selectedBlog.id],
        queryFn: () => getBlogDetail(selectedBlog.id),
        enabled: selectedBlog.id !== null
      });
    
      const {mutate: deleteBlogMutation} = useMutation({
        mutationFn: () => deleteBlog(selectedBlog.id),
        onMutate: () =>{
          setIsDeleting(true);
        },
        onSuccess: () => {
    
          setIsDeleteModalVisible(false);
          message.success("Blog deleted successfully");
          // Invalidate and refetch the userBlogList query
          queryClient.invalidateQueries(['userBlogList']);
        },
        onError: (error) => {
    
          message.error("Failed to delete blog");
          console.error('Failed to delete blog:', error);
        },
    
        onSettled: () => {
          setIsDeleting(false);
        }
      })


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


    if (isLoading) {
        return <Spin size="large" />;
      }
    
      if (error) {
        return <Alert message="Error loading products" type="error" />;
      }


      const handleEdit = (id) => {

        setSelectedBlog({
          id: id
        });
    
        setIsEditModalVisible(true);
    
      }
      
      const handleDelete = (id) => {
    
        setSelectedBlog({
          id: id
        });
    
        setIsDeleteModalVisible(true);
    
      }


  return (
    <div className="dashboard">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <Title className="hero-title">Welcome to All In One For Your Business</Title>
          <Paragraph className="hero-description">
            Discover the best products and articles curated just for you!
          </Paragraph>
          <Button type="primary" size="large" href='/product/listing'>
            Shop Now
          </Button>
        </div>
      </section>

      {/* Business Intro Section */}
      <section className="business-intro-section">
        <div className="business-intro-content">
            <div className="business-intro-img">
            <img src="/images/saas-dev-service.svg" alt="Business" />
            </div>
            <div className="business-intro-text">
            <Title level={2}>About Our Business</Title>
            <Paragraph>
                We offer a wide range of products tailored to meet your needs. Our mission is to deliver quality and excellence.
                We offer a wide range of products tailored to meet your needs. Our mission is to deliver quality and excellence.
                We offer a wide range of products tailored to meet your needs. Our mission is to deliver quality and excellence.
                We offer a wide range of products tailored to meet your needs. Our mission is to deliver quality and excellence.

            </Paragraph>
            </div>
        </div>
      </section>


      {/* Best Selling Products Section */}
      <section className="best-selling-section">
        <Title level={2}>Best Selling Products</Title>
        <div className="product-grid">
          {products?.map((product) => (
            <div className="product-card-wrapper" key={product.id}>
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
            </div>
          ))}
        </div>
      </section>

      {/* New Products Section */}
      <section className="new-products-section">
        <Title level={2}>New Arrivals</Title>
        <div className="product-grid">
          {products?.map((product) => (
            <div className="product-card-wrapper" key={product.id}>
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
            </div>
          ))}
        </div>
      </section>


      {/* Trending Articles Section */}
      <section className="trending-articles-section">
        <Title level={2}>Trending Articles</Title>
        <div className="product-grid">
          {userBlogList?.map((blog, index) => (
            <BlogCard
              title={blog.title}
              id={blog.id}
              onEdit={user.role === "user" ? () => handleEdit(blog.id) : undefined}
              onDelete={user.role === "user" ? () => handleDelete(blog.id) : undefined}
            />
          ))}
        </div>
      </section>


      {/* Call-to-Action Section */}
      <section className="cta-section">
        <Title level={2}>Join Our Community</Title>
        <Paragraph>
          Be a part of our journey and enjoy exclusive offers and updates.
        </Paragraph>
        <Button type="primary" size="large">
          Sign Up Now
        </Button>
      </section>


      {/* Delete Modal */}
    
    <Modal
      title="Confirm Deletion"
      visible={isDeleteModalVisible}
      onOk={() => {
        deleteBlogMutation();
      }}
      onCancel={() =>{
        setIsDeleteModalVisible(false);
      }}
      okText="Confirm"
      cancelText="Cancel"
      okButtonProps={{ danger: true, loading: isDeleting }}
      cancelButtonProps={{disabled: isDeleting}}
      >
      <p>
        Are you sure you want to delete this blog? This action cannot be undone.
      </p>
    </Modal>


    {/* Edit Modal */}
    
    {!loadingBlogDetail && blogDetail && (
  <Modal
    title="Edit Blog"
    visible={isEditModalVisible}
    onCancel={() => {
      setIsEditModalVisible(false);
    }}
    footer={null}
    destroyOnClose
  >
    <Formik
      initialValues={{
        title: blogDetail[0]?.title || "-",
        content: blogDetail[0]?.content || "-",
        status: blogDetail[0]?.status || "-",
        category: blogDetail[0]?.category || "-",
        image: blogDetail[0]?.image || null,
      }}
      validationSchema={createBlogValidationSchema}
      onSubmit={(values) => {
        console.log("Submitted values:", values);
        // Handle form submission logic here
      }}
    >
      {({ touched, errors, setFieldValue }) => (
        <FormikForm className="create-blog-form">
          {/* Title Field */}
          <div className="form-item">
            <Field
              name="title"
              as={Input}
              prefix={<UserOutlined />}
              placeholder="Blog Title"
            />
            {touched.title && errors.title && (
              <div className="error">{errors.title}</div>
            )}
          </div>

          {/* Content Field */}
          <div className="form-item">
            <Field
              name="content"
              as={Input.TextArea}
              placeholder="Blog Content"
              style={{ width: '100%' }}
            />
            {touched.content && errors.content && (
              <div className="error">{errors.content}</div>
            )}
          </div>

          {/* Status Field */}
          <div className="form-item">
            <Select
              name="status"
              placeholder="Select Blog Status"
              onChange={(value) => setFieldValue('status', value)}
              defaultValue={blogDetail?.status || "draft"}
              style={{ width: '40%' }}
            >
              <Option value="draft">Draft</Option>
              <Option value="published">Published</Option>
              <Option value="archived">Archived</Option>
            </Select>
            {touched.status && errors.status && (
              <div className="error">{errors.status}</div>
            )}
          </div>

          {/* Category Field */}
          <div className="form-item">
            <Field
              name="category"
              as={Input}
              placeholder="Category"
              style={{ width: '40%' }}
            />
            {touched.category && errors.category && (
              <div className="error">{errors.category}</div>
            )}
          </div>

          {/* Image Upload Field */}
          <div className="form-item">
            <Upload
              beforeUpload={(file) => {
                setFieldValue('image', file);
                return false; // Prevent automatic upload
              }}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<FileImageOutlined />}>Upload Image</Button>
            </Upload>
            {touched.image && errors.image && (
              <div className="error">{errors.image}</div>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-item">
            <Button
              type="primary"
              htmlType="submit"
              className="create-blog-form-button"
              loading={isEditing}
            >
              Save
            </Button>
          </div>
        </FormikForm>
      )}
    </Formik>
  </Modal>
)}


    </div>
  );
}
