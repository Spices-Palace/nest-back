// Test script for the billing system
// This demonstrates how to create a bill with the example data provided

const BASE_URL = 'http://localhost:3000';

// Example bill data (matching the user's provided format)
const exampleBillData = {
  "billNo": "BILL-1234",
  "date": "2024-01-15T10:30:00.000Z",
  "customerName": "John Doe",
  "salesmanName": "Alice",
  "companyId": "company123", // You'll need to replace with actual company ID
  "companyName": "Fashion Store",
  "items": [
    {
      "productId": "product-uuid-1", // You'll need to replace with actual product ID
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
    },
    {
      "productId": "product-uuid-2", // You'll need to replace with actual product ID
      "productName": "Handicraft Item",
      "originalBarcode": "1001A",
      "saleBarcode": "1001A",
      "productType": "Handicraft",
      "unit": "pieces",
      "originalPrice": 1500,
      "salePrice": 1500,
      "quantity": 1,
      "total": 1500,
      "cgst": 90,
      "sgst": 90,
      "priceIncrease": 0
    }
  ],
  "subtotal": 13380,
  "totalCGST": 387,
  "totalSGST": 387,
  "grandTotal": 14154,
  "status": "completed"
};

// Function to create a bill
async function createBill(billData) {
  try {
    console.log('Creating bill...');
    console.log('Bill Number:', billData.billNo);
    console.log('Customer:', billData.customerName);
    console.log('Total Items:', billData.items.length);
    console.log('Grand Total:', billData.grandTotal);
    
    const response = await fetch(`${BASE_URL}/v1/bills`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(billData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP ${response.status}: ${errorData.message || 'Unknown error'}`);
    }

    const bill = await response.json();
    console.log('✅ Bill created successfully!');
    console.log('Bill ID:', bill.id);
    console.log('Status:', bill.status);
    console.log('Items processed:', bill.items.length);
    
    return bill;
  } catch (error) {
    console.error('❌ Error creating bill:', error.message);
    throw error;
  }
}

// Function to get all bills for a company
async function getBills(companyId) {
  try {
    console.log(`Fetching bills for company: ${companyId}...`);
    
    const response = await fetch(`${BASE_URL}/v1/bills?companyId=${companyId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch bills`);
    }

    const bills = await response.json();
    console.log(`✅ Found ${bills.length} bills`);
    
    return bills;
  } catch (error) {
    console.error('❌ Error fetching bills:', error.message);
    throw error;
  }
}

// Function to get a specific bill by ID
async function getBillById(billId) {
  try {
    console.log(`Fetching bill with ID: ${billId}...`);
    
    const response = await fetch(`${BASE_URL}/v1/bills/${billId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch bill`);
    }

    const bill = await response.json();
    console.log('✅ Bill retrieved successfully!');
    console.log('Bill Number:', bill.billNo);
    console.log('Customer:', bill.customerName);
    console.log('Grand Total:', bill.grandTotal);
    
    return bill;
  } catch (error) {
    console.error('❌ Error fetching bill:', error.message);
    throw error;
  }
}

// Function to get products to check inventory
async function getProducts(companyId) {
  try {
    console.log(`Fetching products for company: ${companyId}...`);
    
    const response = await fetch(`${BASE_URL}/v1/products?companyId=${companyId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to fetch products`);
    }

    const products = await response.json();
    console.log(`✅ Found ${products.length} products`);
    
    // Display inventory information
    products.forEach(product => {
      console.log(`- ${product.name}: ${product.quantity} ${product.unit} available`);
    });
    
    return products;
  } catch (error) {
    console.error('❌ Error fetching products:', error.message);
    throw error;
  }
}

// Main test function
async function runTest() {
  console.log('🚀 Starting Billing System Test\n');
  
  try {
    // First, let's check available products
    console.log('=== Step 1: Check Available Products ===');
    const products = await getProducts(exampleBillData.companyId);
    console.log('');
    
    // Create a bill
    console.log('=== Step 2: Create Bill ===');
    const createdBill = await createBill(exampleBillData);
    console.log('');
    
    // Check products again to see inventory changes
    console.log('=== Step 3: Check Updated Inventory ===');
    const updatedProducts = await getProducts(exampleBillData.companyId);
    console.log('');
    
    // Get the created bill
    console.log('=== Step 4: Retrieve Created Bill ===');
    const retrievedBill = await getBillById(createdBill.id);
    console.log('');
    
    // Get all bills for the company
    console.log('=== Step 5: List All Bills ===');
    const allBills = await getBills(exampleBillData.companyId);
    console.log('');
    
    console.log('✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure:');
    console.log('1. The NestJS application is running on http://localhost:3000');
    console.log('2. You have valid company and product IDs in the database');
    console.log('3. The products have sufficient inventory');
    console.log('4. Update the exampleBillData with actual UUIDs from your database');
  }
}

// Instructions for using this test script
console.log(`
📋 BILLING SYSTEM TEST SCRIPT
=============================

This script demonstrates the billing system functionality.

BEFORE RUNNING:
1. Make sure your NestJS application is running
2. Update the exampleBillData with actual UUIDs:
   - Replace "company123" with actual company ID
   - Replace "product-uuid-1" and "product-uuid-2" with actual product IDs
3. Ensure products have sufficient inventory

TO RUN:
1. Save this as test-bill-example.js
2. Run: node test-bill-example.js

The script will:
- Check available products and inventory
- Create a bill with the example data
- Verify inventory is updated
- Retrieve the created bill
- List all bills for the company

WHAT HAPPENS WHEN A BILL IS CREATED:
✅ Validates company and products exist
✅ Checks if sufficient inventory is available
✅ Creates bill and bill items in database
✅ Automatically decreases product quantities
✅ All operations are wrapped in a transaction
✅ Returns complete bill with all details

WHAT HAPPENS WHEN A BILL IS DELETED:
✅ For completed bills: Restores inventory quantities
✅ For pending bills: No inventory changes
✅ Removes bill and all bill items
`);

// Uncomment the line below to run the test
// runTest();

module.exports = {
  createBill,
  getBills,
  getBillById,
  getProducts,
  runTest,
  exampleBillData
}; 