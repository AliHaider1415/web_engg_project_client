import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Typography, Row, Col, Divider, Avatar, Form, Input, Button, Spin, message } from 'antd';
import { getBlogDetail, getBlogComments, postBlogComment } from '../../services/blog'; // Adjust the path as needed

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export default function BlogDetail() {
  const { id } = useParams(); // Get the blog ID from the URL
  const queryClient = useQueryClient(); // For invalidating the comments query after a new comment is posted

  // Fetch blog details using React Query
  const { data: blogDetail, isLoading, error } = useQuery({
    queryKey: ['blogDetail', id],
    queryFn: () => getBlogDetail(id),
    enabled: !!id, // Only fetch if id exists
  });

  // Fetch comments for the blog post
  const { data: comments, isLoading: isCommentsLoading, error: commentsError } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => getBlogComments(id),
    enabled: !!id, // Only fetch if id exists
  });

  // Mutation for posting a new comment
  const { mutate: postComment, isLoading: isPostingComment } = useMutation({
    mutationFn: (comment) => postBlogComment(id, comment), // Post the comment
    onSuccess: () => {
      // Invalidate and refetch comments after a successful post
      queryClient.invalidateQueries(['comments', id]);
      message.success('Comment posted successfully!');
    },
    onError: (error) => {
      message.error('Failed to post comment');
    },
  });

  const handleCommentSubmit = (values) => {
    postComment(values.comment); // Trigger the mutation with the comment content
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '24px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '24px', color: 'red' }}>
        <Title level={4}>Error loading blog details</Title>
        <Text>{error.message}</Text>
      </div>
    );
  }

  // if (commentsError) {
  //   return (
  //     <div style={{ textAlign: 'center', padding: '24px', color: 'red' }}>
  //       <Title level={4}>Error loading comments</Title>
  //       <Text>{commentsError.message}</Text>
  //     </div>
  //   );
  // }

  return (
    <section style={{ padding: '24px', background: '#f9f9f9' }}>
      <Row gutter={[16, 16]}>
        {/* Blog Content */}
        <Col xs={24} md={16}>
          <div
            style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Title level={2}>{blogDetail[0].title}</Title>
            <Text type="secondary">
              Published on: {new Date(blogDetail[0].created_at).toLocaleDateString()} | Author: {blogDetail[0].author}
            </Text>
            <Divider />
            {blogDetail[0].image && (
              <img
                src={blogDetail[0].image}
                alt="Blog Cover"
                style={{ width: '100%', borderRadius: '8px', marginBottom: '16px' }}
              />
            )}
            <Paragraph>{blogDetail[0].content}</Paragraph>
          </div>
        </Col>

        {/* Sidebar */}
        <Col xs={24} md={8}>
          <div
            style={{
              background: '#fff',
              padding: '24px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Title level={4}>Related Blogs</Title>
            <ul>
              <li>
                <a href="#1">How to Build a Blog with React</a>
              </li>
              <li>
                <a href="#2">10 Tips for Writing Engaging Blog Posts</a>
              </li>
              <li>
                <a href="#3">Understanding Ant Design Components</a>
              </li>
            </ul>
          </div>
        </Col>
      </Row>

      <Divider />

      {/* Comments Section */}
<div
  style={{
    background: '#fff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  }}
>
  <Title level={4}>Comments</Title>

  {/* Display comments */}
  <Divider />
  {comments?.length > 0 ? (
    comments.map((comment) => (
      <div key={comment.id} style={{ marginBottom: '16px' }}>
        <Avatar size="small" style={{ marginRight: '8px' }}>
          {comment.author.username[0]} {/* First letter of the username */}
        </Avatar>
        <Text strong>{comment.author.username}</Text> {/* Display the author's username */}
        <Paragraph>{comment.content}</Paragraph>
      </div>
    ))
  ) : (
    <Text>No comments yet. Be the first to comment!</Text>
  )}

  {/* Comment form */}
  <Form onFinish={handleCommentSubmit}>
    <Form.Item
      name="comment"
      rules={[{ required: true, message: 'Please write a comment!' }]}
    >
      <TextArea rows={4} placeholder="Write your comment here..." />
    </Form.Item>
    <Form.Item>
      <Button type="primary" htmlType="submit" loading={isPostingComment}>
        {isPostingComment ? 'Posting Comment...' : 'Add Comment'}
      </Button>
    </Form.Item>
  </Form>
</div>


    </section>
  );
}
