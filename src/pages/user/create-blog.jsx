import {React, useState} from 'react';
import { Input, Button,Typography, message, Select, Upload } from 'antd';
import { createBlogValidationSchema } from '../../schema/schema';
import { Formik, Field, Form as FormikForm } from 'formik';
import { UserOutlined, LockOutlined, FileImageOutlined } from '@ant-design/icons';
import '../../css/create-blog.css';
import { createBlog } from '../../services/blog';
import { useMutation } from '@tanstack/react-query';


const {Title} = Typography;
const { Option } = Select;

export default function CreateBlog() {


    const [isCreating, setIsCreating] = useState(false);


  const { mutate: newBlogMutation, isLoading, isError, error } = useMutation({
    mutationFn: createBlog,
    onMutate: () => setIsCreating(true),
    onSettled: () => setIsCreating(false),
    onSuccess: (data) => {

        message.success('Blog Created Successfully');
   
    },
    onError: (error) => {
        
        message.error("Error while creating blog");
        console.error('New Blog failed:', error);
    },
});


    const handleSubmit = (values) => {

        newBlogMutation(values);

    }


  return (
    <>
    
    <section className="new-blog-container">
        <Title level = {2}>Create New Blog</Title>

        <Formik
      initialValues={{
        title: '',
        content: '',
        status: 'draft', // default status
        category: '',
        image: null,
      }}
      validationSchema={createBlogValidationSchema}
      onSubmit={handleSubmit}
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
              defaultValue="draft"
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
            <Button type="primary" htmlType="submit" className="create-blog-form-button" loading = {isCreating}>
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
