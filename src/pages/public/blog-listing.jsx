import React, { useState } from 'react';
import { Typography, Pagination, Button, message, Modal, Select, Upload, Input } from 'antd';
import { Formik, Field, Form as FormikForm } from 'formik';
import BlogCard from '../../components/blog-card';
import "../../css/blog-listing.css";
import SearchInput from '../../components/search-input';
import CategoryTab from '../../components/category-tab';
import useUserStore from '../../store/user-store';
import { UserOutlined, LockOutlined, FileImageOutlined } from '@ant-design/icons';
import { createBlogValidationSchema } from '../../schema/schema';
import { getUserBlogList, getGuestBlogList, deleteBlog, editBlog, getBlogDetail, getBlogsCount } from '../../services/blog';
import { useQuery, useMutation, useQueryClient} from '@tanstack/react-query';

const { Title } = Typography;
const { Option } = Select;

export default function BlogListing() {

  const queryClient = useQueryClient();

  const { user } = useUserStore();
  const [status, setStatus] = useState(null);
  const [category, setCategory] = useState("General");
  const [selectedBlog, setSelectedBlog] = useState({
    id: null
  });

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Dynamic tabs data
  const tabs = [
    { title: "General", count: 10 },
    { title: "Science Fiction", count: 8 },
    { title: "Technology", count: 12 },
    { title: "Health", count: 5 },
    { title: "Travel", count: 7 },
    { title: "Testing", count: 7 },
  ];

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

  const { data: userBlogList, isLoading: loadingUserBlogList } = useQuery({
    queryKey: ['userBlogList', status, category, user.role], // Include user.role to refetch when it changes
    queryFn: () => {
      if (user.role === 'user') {
        return getUserBlogList(status, category);
      } else if (user.role === 'guest') {
        return getGuestBlogList(status, category);
      } else {
        throw new Error('Invalid user role');
      }
    },
    enabled: !!user, // Ensure the query only runs when the user object is available
  });


  const { data: blogsCount, isLoading: loadingBlogsCount } = useQuery({
    queryKey: ['userBlogList', status, category, user.role], // Include user.role to refetch when it changes
    queryFn: () => { getBlogsCount() },
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


  const {mutate: editBlogMutation} = useMutation({
    mutationFn: (values) => editBlog(selectedBlog.id, values),
    onMutate: () =>{
      setIsEditing(true);
    },
    onSuccess: () => {

      setIsEditModalVisible(false);
      message.success("Blog Edited successfully");
      // Invalidate and refetch the userBlogList query
      queryClient.invalidateQueries(['userBlogList']);
    },
    onError: (error) => {

      message.error("Failed to edit blog");
      console.error('Failed to edit blog:', error);
    },
    onSettled: () => {
      setIsEditing(false);
    }
  })


  return (
    <>
    <section className='listing-container'>

      <div className="listing-header">

        <div className="left-section">
          <Title level={2}>
            Blogs - {category ? category : "All"}
          </Title>

          {
            user.role === "user" && (
              <Button type="primary" href='/blog/create' className="create-blog-button">
                Create New Blog
              </Button>
            )
          }
        </div>

        <SearchInput />

      </div>

      {/* Tabs */}
      <div className="listing-tabs">
        {tabs.map((tab, index) => (
          <CategoryTab
            key={index}
            text={`${tab.title}`}
            selected={category === tab.title}
            onClick={() => setCategory(tab.title)}
          />
        ))}
      </div>

      <br />

      {/* Blog cards */}
      <div className="card-flexbox">
        {userBlogList?.map((blog, index) => (
          <BlogCard
            title={blog.title}
            id={blog.id}
            onEdit={user.role === "user" ? () => handleEdit(blog.id) : undefined}
            onDelete={user.role === "user" ? () => handleDelete(blog.id) : undefined}
          />
        ))}
      </div>


      {/* Pagination */}
      <Pagination align="end" defaultCurrent={1} total={50} />

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



</>
  );
}
