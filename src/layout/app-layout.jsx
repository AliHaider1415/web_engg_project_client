import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  ReadOutlined, ShoppingOutlined, ExperimentOutlined
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Header from '../components/header';
import CustomSider from '../components/custom-sider';
import '../css/app-layout.css';
import useUserStore from '../store/user-store';


const {Content, Footer } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [

  getItem('Dashboard', '1', <PieChartOutlined />),
  getItem('Blog', 'sub1', <ReadOutlined  />, [

    getItem('Inventory', '3', <ExperimentOutlined />),
    
  ]),
  getItem('Product', 'sub2', <ShoppingOutlined/>, [getItem('Inventory', '4', <ExperimentOutlined />)]),
  
];


const AppLayout = ({ children }) => {

  const {user} = useUserStore();

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  const filteredItems = items.map(item => {
    if (user.role === 'guest' && item.children) {
      // Remove children (sub-tabs) for "guest" users
      return {
        ...item,
        children: item.children.filter(child => child.key !== '3' && child.key !== '4'), // Filter out the sub-tabs
      };
    }
    return item; // Keep item as is for "user" or other roles
  });
  
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <CustomSider items = {filteredItems}/>

      <Layout>

        <Header
          
        />

        <Content
          style={{
            margin: '0 16px',
          }}
        >
          
          <div>
            {children}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default AppLayout;