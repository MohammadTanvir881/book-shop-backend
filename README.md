Overview
This project is a Bookstore Management System that provides a comprehensive API for managing books and processing customer orders. It includes functionalities to create, retrieve, update, delete books, place orders, and calculate total revenue from sales.

Features
Product Management (Books)
Create a Book

Endpoint: POST /api/products
Adds a new book to the inventory with details like title, author, price, category, description, quantity, and availability.
Get All Books

Endpoint: GET /api/products
Fetches a list of all books or searches for books by title, author, or category using the searchTerm query parameter.
Get a Specific Book

Endpoint: GET /api/products/:productId
Retrieves the details of a specific book using its unique ID.
Update a Book

Endpoint: PUT /api/products/:productId
Updates the details of an existing book, such as price or quantity.
Delete a Book

Endpoint: DELETE /api/products/:productId
Removes a book from the inventory.
Order Management
Place an Order

Endpoint: POST /api/orders
Creates an order by specifying the customer's email, the book being purchased, and the quantity.
Automatically updates inventory:
Reduces book quantity based on the order.
Sets inStock to false if inventory reaches zero.
Handles insufficient stock scenarios with meaningful error responses.
Calculate Revenue

Endpoint: GET /api/orders/revenue
Uses aggregation to calculate the total revenue from all orders by multiplying the book price with the quantity sold.
Error Handling
Generic Error Response:
Provides detailed feedback for validation errors, resource issues, or unexpected failures.
Includes error type, error description, and a stack trace for debugging.



Technology Stack
Backend Framework: Node.js with Express.js
Database: MongoDB for storing and managing data
Validation: Mongoose schema for model validation and zod validation
API Testing: Postman or equivalent