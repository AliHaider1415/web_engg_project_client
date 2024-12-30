import * as Yup from 'yup';


export const loginValidationSchema = Yup.object({
    user_name: Yup.string()
      .required('Please input your username!'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Please input your password!'),
  });


export const signupValidationSchema = Yup.object({

    user_name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),

    phone: Yup.string()
      .required('Phone number is required')
      .matches(
        /^[0-9]{10,15}$/,
        'Phone number must be between 10 to 15 digits and contain only numbers'
      ),

    email: Yup.string()
      .required('Email is required')
      .email('Invalid email address'),

    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(20, 'Password must not exceed 20 characters'),

      role: Yup.string()
      .required('User role is required')
      

  });



  export const createBlogValidationSchema = Yup.object({

    title: Yup.string()
    .required('Title is required')
    .max(255, 'Title should not exceed 255 characters'),
  
    content: Yup.string()
      .required('Content is required'),
    
    status: Yup.string()
      .oneOf(['draft', 'published', 'archived'], 'Invalid status')
      .required('Status is required'),
    
    category: Yup.string()
      .max(100, 'Category should not exceed 100 characters')
      .required("Category is required"),
    
    image: Yup.mixed()
      .nullable()
      .test('fileSize', 'File too large', value => {
        // Optional: Check for file size if needed (example: 5MB)
        return !value || (value && value.size <= 5 * 1024 * 1024); // 5MB
      })
      .test('fileType', 'Unsupported file type', value => {
        // Optional: Check for file type if needed
        return !value || ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
      }),
      
  });

  export const createProductValidationSchema = Yup.object({
    name: Yup.string()
      .max(255, "Name must be at most 255 characters")
      .required("Name is required"),
  
    description: Yup.string()
      .required("Description is required"),
  
    price: Yup.number()
      .typeError("Price must be a number")
      .positive("Price must be greater than 0")
      .max(99999999.99, "Price must be less than or equal to 99999999.99")
      .required("Price is required"),
  
    stock_quantity: Yup.number()
      .typeError("Stock quantity must be a number")
      .integer("Stock quantity must be an integer")
      .min(0, "Stock quantity must be at least 0")
      .required("Stock quantity is required"),
  
    category: Yup.string()
      .required("Category is required"),
  
    image: Yup.mixed()
      .nullable()  // Allow image to be null
      .test("fileSize", "Image size must be less than 5MB", (value) => {
        return !value || (value && value.size <= 5 * 1024 * 1024);
      })
      .test("fileType", "Image must be a valid format (jpeg, png)", (value) => {
        return (
          !value ||
          (value && ["image/jpeg", "image/png"].includes(value.type))
        );
      }),
  });
  