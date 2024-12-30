import {React, useState} from 'react';
import { Input, Button,Typography, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Formik, Field, Form as FormikForm } from 'formik';
import {loginValidationSchema} from '../../schema/schema.js';
import { loginUser } from '../../services/auth.js';
import useUserStore from '../../store/user-store.js';
import "../../css/login.css";
import { useNavigate } from 'react-router-dom';

const { Text, Link } = Typography;
const Login = () => {

  const navigate = useNavigate();

  const { setUser } = useUserStore();

  const [isLoggingIn, setIsLoggingIn] = useState(false);


  const { mutate: loginMutation, isLoading, isError, error } = useMutation({
    mutationFn: loginUser,
    onMutate: () => setIsLoggingIn(true),
    onSettled: () => setIsLoggingIn(false),
    onSuccess: (data) => {


        const { user_name, email, role } = data;
        setUser({ user_name, email, role});

        message.success('Login Successfully');
        

        // switch(user_type){
        //     case 'admin':
        //         navigate('/admin');
        //         break;

        //     case 'sales_manager':
        //         navigate('/sales-manager');
        //         break;

        //     case 'sales_executive':
        //         navigate('/sales-executive');
        //         break;
        // }

        navigate('/dashboard');
       
        
    },
    onError: (error) => {
        
        message.error(error.detail);
        console.error('Login failed:', error);
    },
});



  const onSubmit = (values) => {

    loginMutation(values);

  };


  return (
    <section className='login-section'>
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        <Formik
          initialValues={{ user_name: '', password: '' }}
          validationSchema={loginValidationSchema}
          onSubmit={onSubmit}
        >
          {({ touched, errors }) => (
            <FormikForm className="login-form">
              <div className="form-item">
                <Field
                  name="user_name"
                  as={Input}
                  prefix={<UserOutlined />}
                  placeholder="User Name"
                />
                {touched.user_name && errors.user_name && (
                  <div className="error">{errors.user_name}</div>
                )}
              </div>

              <div className="form-item">
                <Field
                  name="password"
                  as={Input.Password}
                  prefix={<LockOutlined />}
                  placeholder="Password"
                />
                {touched.password && errors.password && (
                  <div className="error">{errors.password}</div>
                )}
              </div>

              <div className="form-item">
                <Button type="primary" htmlType="submit" className="login-form-button" loading = {isLoggingIn}>
                  Log in
                </Button>
              </div>

                <Text>No account? <Link href='/sign-up' disabled = {isLoggingIn}>Sign Up</Link></Text>

            </FormikForm>
          )}
        </Formik>
      </div>
    </section>
  );
};

export default Login;
