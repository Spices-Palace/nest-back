# Billing System for Dress Shop

A comprehensive billing system built with NestJS and TypeORM for managing dress shop inventory and sales.

## Features

### 1. Bill Creation with Inventory Management
- **Automatic Inventory Updates**: When a bill is created, product quantities are automatically decreased
- **Inventory Validation**: System checks if sufficient inventory is available before creating a bill
- **Transaction Safety**: All operations are wrapped in database transactions for data consistency

### 2. Bill Management
- Create bills with multiple items
- Track bill status (pending, completed, cancelled)
- View bill history by company
- Search bills by bill number
- Update bill status
- Delete bills (with inventory restoration for completed bills)

### 3. Product Inventory
- Real-time inventory tracking
- Automatic quantity updates on sales
- Inventory availability checks
- Product management with pricing

## API Endpoints

### Bills

#### Create a Bill
```http
POST /v1/bills
Content-Type: application/json

{
  "billNo": "BILL-1234",
  "date": "2024-01-15T10:30:00.000Z",
  "customerName": "John Doe",
  "salesmanName": "Alice",
  "companyId": "company123",
  "salesmanId": "salesman123", // optional
  "items": [
    {
      "productId": "product-uuid-1",
      "productName": "Silk Saree",
      "originalBarcode": "1000A",
      "saleBarcode": "1000A001",
      "productType": "Saree",
      "unit": "pieces",
      "originalPrice": 5840,
      "salePrice": 5940,
      "quantity": 2,
      "total": 11880,
      "cgst": 297,
      "sgst": 297,
      "priceIncrease": 100
    }
  ],
  "subtotal": 13380,
  "totalCGST": 387,
  "totalSGST": 387,
  "grandTotal": 14154,
  "status": "completed"
}
```

#### Get All Bills
```http
GET /v1/bills?companyId=company123
```

#### Get Bill by ID
```http
GET /v1/bills/{billId}
```

#### Get Bill by Bill Number
```http
GET /v1/bills/bill-no/{billNo}
```

#### Update Bill Status
```http
PUT /v1/bills/{billId}/status
Content-Type: application/json

{
  "status": "completed"
}
```

#### Delete Bill
```http
DELETE /v1/bills/{billId}
```

### Products

#### Get All Products
```http
GET /v1/products?companyId=company123
```

#### Update Product Quantity
```http
PUT /v1/products/{productId}
Content-Type: application/json

{
  "quantity": 10
}
```

## What Happens When a Bill is Created

### 1. Validation Phase
- Validates that the company exists
- Validates that the salesman exists (if provided)
- Validates that all products exist
- Checks if sufficient inventory is available for each product

### 2. Transaction Processing
- Creates the bill record
- Creates bill item records for each product
- **Automatically decreases product quantities** by the sold amount
- All operations are wrapped in a database transaction

### 3. Error Handling
- If any validation fails, the entire transaction is rolled back
- If inventory is insufficient, an error is returned with details
- If any product is not found, the transaction is cancelled

### 4. Success Response
- Returns the complete bill with all items and relationships
- Product quantities are permanently reduced
- Bill status is set to "completed" by default

## What Happens When a Bill is Deleted

### For Completed Bills
- **Inventory is automatically restored** to the products
- All bill items are deleted
- The bill record is removed

### For Pending/Cancelled Bills
- Bill items and bill record are deleted
- No inventory changes (since quantities weren't reduced)

## Database Schema

### Bill Entity
- `id`: Unique identifier
- `billNo`: Bill number (unique)
- `date`: Bill date
- `customerName`: Customer name
- `salesmanName`: Salesman name
- `company`: Company relationship
- `salesman`: Salesman relationship (optional)
- `items`: Bill items relationship
- `subtotal`: Subtotal amount
- `totalCGST`: Total CGST
- `totalSGST`: Total SGST
- `grandTotal`: Grand total
- `status`: Bill status (pending/completed/cancelled)

### BillItem Entity
- `id`: Unique identifier
- `bill`: Bill relationship
- `product`: Product relationship
- `productName`: Product name
- `originalBarcode`: Original barcode
- `saleBarcode`: Sale barcode
- `productType`: Product type
- `unit`: Unit of measurement
- `originalPrice`: Original price
- `salePrice`: Sale price
- `quantity`: Quantity sold
- `total`: Total for this item
- `cgst`: CGST amount
- `sgst`: SGST amount
- `priceIncrease`: Price increase amount

## Example Usage

### Creating a Bill
```javascript
const billData = {
  billNo: "BILL-1234",
  date: "2024-01-15T10:30:00.000Z",
  customerName: "John Doe",
  salesmanName: "Alice",
  companyId: "company123",
  items: [
    {
      productId: "product-uuid-1",
      productName: "Silk Saree",
      originalBarcode: "1000A",
      saleBarcode: "1000A001",
      productType: "Saree",
      unit: "pieces",
      originalPrice: 5840,
      salePrice: 5940,
      quantity: 2,
      total: 11880,
      cgst: 297,
      sgst: 297,
      priceIncrease: 100
    }
  ],
  subtotal: 13380,
  totalCGST: 387,
  totalSGST: 387,
  grandTotal: 14154,
  status: "completed"
};

const response = await fetch('/v1/bills', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(billData)
});

const bill = await response.json();
console.log('Bill created:', bill);
```

### Checking Product Inventory
```javascript
const products = await fetch('/v1/products?companyId=company123');
const productList = await products.json();
console.log('Available products:', productList);
```

## Error Handling

The system provides detailed error messages for various scenarios:

- **Insufficient Inventory**: `Insufficient inventory for product {name}. Available: {available}, Requested: {requested}`
- **Product Not Found**: `Product with ID {id} not found`
- **Company Not Found**: `Company not found`
- **Salesman Not Found**: `Salesman not found`

## Security Features

- Input validation using class-validator
- Database transaction safety
- Proper error handling and rollback mechanisms
- Company-based data isolation

## Running the Application

1. Install dependencies:
```bash
npm install
```

2. Configure your database connection in the TypeORM configuration

3. Run migrations to create the database tables

4. Start the application:
```bash
npm run start:dev
```

The billing system will be available at `http://localhost:3000/v1/bills` 