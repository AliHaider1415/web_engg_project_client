import React from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import useUserStore from '../store/user-store';

const { Meta } = Card;

export default function BlogCard({ id, title, description, img, onDelete, onEdit }) {
  const { user } = useUserStore();

  const actions = [
    ...(user.role === "user"
      ? [
          <DeleteOutlined className="normal-icon" key="delete" onClick={onDelete} />,
          <EditOutlined className="normal-icon" key="edit" onClick={onEdit} />,
        ]
      : []),
    <div key="read-more">
      <a href={`/blog/detail/${id}`}>Read More</a>
    </div>,
  ];

  return (
    <Card
      hoverable={true}
      style={{ width: 300 }}
      cover={
        <img
          alt="example"
          src={img ? img : "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"}
        />
      }
      actions={actions}
    >
      <Meta
        avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
        title={title}
        // description={description}
      />
    </Card>
  );
}
