import {React, useState} from 'react';
import { Input, Button, Select, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { LockOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { Formik, Field, Form as FormikForm } from 'formik';
import {signupValidationSchema} from '../../schema/schema.js';
import * as Yup from 'yup';
import "../../css/login.css";
import { registerUser } from '../../services/auth.js';


const Register = () => {

  const [isCreating, setIsCreating] = useState(false);


  const { mutate: registerMutation, isLoading, isError, error } = useMutation({
    mutationFn: registerUser,
    onMutate: () => setIsCreating(true),
    onSettled: () => setIsCreating(false),
    onSuccess: (data) => {

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
       
        
    },
    onError: (error) => {
        
        message.error(error.detail);
        console.error('Registeration failed:', error);
    },
});



  const onSubmit = (values) => {
    
    registerMutation(values);
   
  };


  return (
    <section className='login-section'>
      <div className="login-container">
        <h2 className="login-title">Sign Up</h2>
        <Formik
          initialValues={{ 
            user_name: '',
            phone: '',
            email: '',
            password: '',
            role: '',
          }}
          validationSchema={signupValidationSchema}
          onSubmit={onSubmit}
        >
          {({ touched, errors, setFieldValue }) => (
            <FormikForm className="login-form">
              {/* Name Field */}
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

              {/* Phone Field */}
              <div className="form-item">
                <Field
                  name="phone"
                  as={Input}
                  prefix={<PhoneOutlined />}
                  placeholder="Phone"
                />
                {touched.phone && errors.phone && (
                  <div className="error">{errors.phone}</div>
                )}
              </div>

              {/* Email Field */}
              <div className="form-item">
                <Field
                  name="email"
                  as={Input}
                  prefix={<UserOutlined />}
                  placeholder="Email"
                />
                {touched.email && errors.email && (
                  <div className="error">{errors.email}</div>
                )}
              </div>

              {/* Password Field */}
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

              {/* User Type Field */}
              <div className="form-item">
                <Select
                  name="role"
                  placeholder="Select User Type"
                  className="user-type-select"
                  onChange={(value) => setFieldValue('role', value)}
                  style={{
                    textAlign: "left"
                  }}

                  options={[
                    {
                      value: 'user',
                      label: 'User',
                    },
                    {
                      value: 'guest',
                      label: 'Guest',
                    },
                    
                  ]}

                >
                  
                </Select>
                {touched.role && errors.role && (
                  <div className="error">{errors.role}</div>
                )}
              </div>

              {/* Submit Button */}
              <div className="form-item">
                <Button type="primary" htmlType="submit" className="login-form-button" loading = {isCreating}>
                  Sign Up
                </Button>
              </div>
            </FormikForm>
          )}
        </Formik>
      </div>
    </section>
  );
};

export default Register;
