import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button } from 'antd';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const CustomSider = ({ items }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1300);


  const checkScreenWidth = () => {
    const isNowMobile = window.innerWidth < 1300;
    setIsMobile(isNowMobile);
    if (isNowMobile) {
      setCollapsed(true);
    }
  };


  useEffect(() => {
    checkScreenWidth();
    window.addEventListener('resize', checkScreenWidth);
    
    return () => {
      window.removeEventListener('resize', checkScreenWidth);
      
    };
  }, []);


  useEffect(() => {
    console.log("Collapsed State: ", collapsed);
  }, [collapsed])


  const handleTriggerClick = () => {
    setCollapsed(!collapsed);
  };

  const handleCloseClick = () => {
    setCollapsed(true); // Close the Sider
  };

  return (
    <>
      {isMobile && collapsed && (
        <Button
          type="primary"
          icon={<MenuOutlined />}
          onClick={handleTriggerClick}
          style={{ position: 'absolute', top: 20, left: 20, zIndex: 9999 }}
        />
      )}

      <Sider
        style={{
          display: (collapsed && isMobile) ? 'none' : 'block',
          position: (isMobile) ? 'absolute': 'relative',
          zIndex: 9999,
          top: 0,
          left: 0,
          bottom: 0,
          minHeight: '100vh',
          transition: 'all 0.3s ease'
        }}
        trigger={null}  // Disable default trigger
      >
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />

        {/* Close button on the right edge of the Sider */}

        {
          isMobile && (
            <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={handleCloseClick}
          style={{
            position: 'absolute',
            top: 450,
            right: 10,
            zIndex: 10000,
            background: 'white',
            borderRadius: 50,
            border: 'none',
            color: 'blue',
          }}
        />
          )
        }

      </Sider>
    </>
  );
};

export default CustomSider;
