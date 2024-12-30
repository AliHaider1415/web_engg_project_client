import React from 'react';
import {Typography, Badge } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import "../css/header.css";
import useUserStore from '../store/user-store';
import { useNavigate } from 'react-router-dom';

const {Text, Link} = Typography;

export default function Header() {

    const {user, clearUser} = useUserStore();

    const navigate = useNavigate();

    const handleLogOut = () => {
        clearUser();
        navigate('/');
    }

  return (
    <section className='layout-header'>

        <div className = "right-section">

            <div className="user-info">

                <UserOutlined className='normal-icon'/>
                <Text className='normal-text'>
                    {user.user_name}
                </Text>
            </div>

            <div className="btn-section">
                <Link className='normal-text' href = "/sign-up" >Register</Link>
                <Link className='normal-text' onClick={handleLogOut}>Log Out</Link>
            </div>
            
            <div
                className="icon-section"
                style={{
                    cursor: 'pointer',
                    display: 'inline-block',
                }}
                onClick={() => navigate('/cart')}
                >
                <Badge count={2} offset={[8, 0]} size="small" showZero>
                    <ShoppingCartOutlined style={{ fontSize: '24px', color: '#000' }} />
                </Badge>
            </div>
            
        </div>
    </section>
  )
}
