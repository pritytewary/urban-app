# This is an Urban Api

### Dependencies

##### Express ,Mongoose,jwt,bcryptjs,dotenv

1. Express Install Process

- npm init -y
- npm install express

2. Mongoose install Process

- npm install mongoose

## Run the Server

###### npm run dev

##### open browser type "http//localhost8080

#### Learn more https://expressjs.com/

#### Routes

### Customer

- [x] `/customer/register` - POST
- [x] `/customer/login` - POST
- [x]`/customer/bookings` - POST - Create booking
- [x] `/customer/bookings` - GET - List of all booking
- [x] `/customer/bookings/[id]` - GET - Get details of the booking
- [x] `/customer/bookings/[id]/cancel` - POST - Cancel booking
- [x] `/customer/bookings/[id]/review` - POST - Write the review
- [x] `/customer/services` - GET - Get list of all published services

### Professional

- [x] `/professional/register` - POST
- [x] `/professional/login` - POST
- [x] `/professional/services` - GET - List of all services
- [x] `/professional/services` - POST - Create service
- [x] `/professional/services/[id]` - GET - Get the serive by id
- [x] `/professional/services/[id]/toggle` - POST - Publish or Unpublish service
- [x] `/professional/bookings` - GET - List of all bookings
- [x] `/professional/bookings/[id]/approve` - POST - Approve, Cancel, Complete
- [x] `/professional/bookings/[id]/cancel` - POST - Approve, Cancel, Complete
- [x] `/professional/bookings/[id]/completed` - POST - Approve, Cancel, Complete

---

### In this Routes what you can do

- Customer can register and login with token
- Customer can book a Service
- Customer can cancel a booking
- Customer can change a Service date
- Cusomer can update a Service
- Professional can register and login with token
- Professional can add a Service
- Professional get all bookings
- professional can cancel a booking
- Professional can confirm a booking
