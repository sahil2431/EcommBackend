# Ecommerce Backend

This is a Node.js backend application for an ecommerce platform. It provides APIs for user authentication, product management, order management, and more.

## Prerequisites

- Node.js (v14 or later)
- MongoDB (v4 or later)

## Features

- **User Authentication**
  - User registration and login
  - User verification using nodemailer
  - JSON Web Token (JWT) based authentication
  - Role-based access control (admin and regular users)

- **Product Management**
  - Create, read, update, and delete products
  - Search and filter products
  - Product categorie

- **Cart Management**
  - Add and remove items from the cart
  - Update cart item quantities
  - Get All the Cart Items Details

- **Order Management**
  - Create orders with multiple products
  - Get All the Order Details with the address and products Details

- **Wishlist Management**
  - Add , Remove items from the wishlist
  - Get all wishlisted products

- **Reviews Managemenet**
  - Add and edit reviews
  - Get all the reviews of user

- **Payment Management**
  - Razorpay payment gateway added for smooth transaction
  - Payment details are saved in database

  
- Working on new features......

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/ecommerce-backend.git
    cd ecommerce-backend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add the following variables:
    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/ecommerce
    JWT_SECRET=your_jwt_secret
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret
    EMAIL_SERVICE=your_email_service
    EMAIL_USER=your_email@example.com
    EMAIL_PASS=your_email_password
    ```

4. Start the server:
    ```sh
    npm start
    ```


