import {React, useState} from 'react';
import { Input, Button,Typography, message, Select, Upload } from 'antd';
import { createProductValidationSchema } from '../../schema/schema';
import { Formik, Field, Form as FormikForm } from 'formik';
import { UserOutlined, LockOutlined, FileImageOutlined } from '@ant-design/icons';
import '../../css/create-product.css';
import { createProduct } from '../../services/product';
import { useMutation } from '@tanstack/react-query';


const {Title} = Typography;
const { Option } = Select;

export default function CreateProduct() {


    const [isCreating, setIsCreating] = useState(false);


  const { mutate: newProductMutation, isLoading, isError, error } = useMutation({
    mutationFn: createProduct,
    onMutate: () => setIsCreating(true),
    onSettled: () => setIsCreating(false),
    onSuccess: (data) => {

        message.success('Product Created Successfully');
   
    },
    onError: (error) => {
        
        message.error("Error while creating product");
        console.error('New Product failed:', error);
    },
});


    const handleSubmit = (values) => {

        newProductMutation(values);

    }


  return (
    <>
    
    <section className="new-product-container container mt-5">
  <Title level={2}>Create New Product</Title>

  <Formik
    initialValues={{
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      category: '',
      image: null,
    }}
    validationSchema={createProductValidationSchema}
    onSubmit={handleSubmit}
  >
    {({ touched, errors, setFieldValue }) => (
      <FormikForm className="create-product-form">
        {/* Name Field */}
        <div className="form-item">
          <Field
            name="name"
            as={Input}
            placeholder="Product Name"
          />
          {touched.name && errors.name && (
            <div className="error">{errors.name}</div>
          )}
        </div>

        {/* Description Field */}
        <div className="form-item">
          <Field
            name="description"
            as={Input.TextArea}
            placeholder="Product Description"
            style={{ width: '100%' }}
          />
          {touched.description && errors.description && (
            <div className="error">{errors.description}</div>
          )}
        </div>

        {/* Price Field */}
        <div className="form-item">
          <Field
            name="price"
            as={Input}
            placeholder="Price"
            type="number"
            style={{ width: '40%' }}
          />
          {touched.price && errors.price && (
            <div className="error">{errors.price}</div>
          )}
        </div>

        {/* Stock Quantity Field */}
        <div className="form-item">
          <Field
            name="stock_quantity"
            as={Input}
            placeholder="Stock Quantity"
            type="number"
            style={{ width: '40%' }}
          />
          {touched.stock_quantity && errors.stock_quantity && (
            <div className="error">{errors.stock_quantity}</div>
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
            accept="image/jpeg,image/png"
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
            className="create-product-form-button"
            loading={isCreating}
          >
            Save
          </Button>
        </div>
      </FormikForm>
    )}
  </Formik>
</section>

    </>
  )
}
