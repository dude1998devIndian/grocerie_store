# Grocery Store POS System

A modern, fully-functional Angular 18 Grocery Store Point of Sale (POS) system with Material Design UI, built with standalone components and Angular Signals.

## Features

### 📊 Dashboard
- Real-time sales metrics
- Daily sales summary
- Top-selling items analysis
- Order analytics

### 🛒 POS (Point of Sale)
- Product browsing with images
- Category-based filtering
- Search functionality
- Real-time cart management
- Quantity adjustment
- Stock tracking with low-stock warnings

### 📦 Product Management
- View all products
- Add new products
- Edit product details
- Delete products
- Search by name, category, or barcode
- Stock management with inventory tracking

### 💳 Billing & Checkout
- Cart review
- Customer information (optional)
- Payment type selection (Cash, UPI, Card)
- Tax calculation (18% GST)
- Automatic stock updates

### 🧾 Receipt System
- Printable invoices
- Auto-incrementing bill numbers
- Detailed order itemization
- Professional receipt layout
- Print-ready format

### 📈 Sales Reports
- Daily sales summary
- Top 10 selling items
- Complete order history
- Revenue tracking
- Payment type analysis

## Tech Stack

- **Framework:** Angular 18
- **UI Library:** Angular Material
- **State Management:** Angular Signals
- **Styling:** SCSS
- **Language:** TypeScript
- **Build Tool:** Angular CLI

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── models/           # Interfaces & models
│   │   ├── services/         # Business logic services
│   │   └── guards/           # Route guards
│   ├── features/
│   │   ├── dashboard/        # Dashboard component
│   │   ├── products/         # Product management
│   │   ├── pos/              # POS/Shopping view
│   │   ├── billing/          # Checkout & receipt
│   │   └── reports/          # Analytics & reports
│   ├── shared/
│   │   ├── components/       # Reusable components
│   │   ├── pipes/            # Custom pipes
│   │   └── directives/       # Custom directives
│   └── app.routes.ts         # Routing configuration
├── assets/                   # Static assets
├── styles.scss              # Global styles
└── index.html               # Main HTML file
```

## Mock Data

The application includes comprehensive mock data for:

- **Groceries:** Vegetables, Fruits, Rice & Grains, Pulses & Lentils, Spices, Dairy
- **Products:** 30+ grocery items with realistic pricing
- **Categories:** 6 main categories (expandable)
- **Stock:** Random stock levels for each product

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

The application will be available at `http://localhost:4200`

## Usage

### 1. Dashboard
- View today's sales metrics
- See top-selling items
- Access quick analytics

### 2. Product Management
- Browse all products
- Add new items
- Edit existing products
- Search functionality
- Manage stock

### 3. POS/Shopping
- Select products
- Adjust quantities
- View cart summary
- Proceed to checkout

### 4. Billing
- Review cart items
- Enter customer information
- Select payment method
- Process payment

### 5. Receipt & Reports
- Print invoices
- View sales history
- Generate reports
- Analyze top items

## Data Persistence

The application uses **LocalStorage** for persistent data:

- Products list
- Shopping cart
- Orders history
- Bill counter

Data persists across browser sessions and can be cleared via browser DevTools.

## Grocery Dataset

### Categories & Items

1. **Vegetables** (7 items): Potato, Onion, Tomato, Brinjal, Okra, Cabbage, Cauliflower
2. **Fruits** (6 items): Banana, Apple, Orange, Mango, Papaya, Pineapple
3. **Rice & Grains** (5 items): White Rice, Basmati Rice, Brown Rice, Poha, Semolina
4. **Pulses & Lentils** (5 items): Toor Dal, Moong Dal, Masoor Dal, Urad Dal, Chana Dal
5. **Spices** (4 items): Turmeric Powder, Red Chilli Powder, Coriander Powder, Cumin Seeds
6. **Dairy** (5 items): Milk, Curd, Paneer, Butter, Cheese

### Product Attributes

- **ID:** Unique identifier
- **Name:** Product name
- **Category:** Product category
- **Price:** Dynamic pricing based on category
- **Unit:** kg, packet, liter, piece
- **Stock:** Random stock levels (50-550 units)
- **Barcode:** Auto-generated barcode

## Key Features

### 🔍 Smart Search
- Search by product name
- Search by barcode
- Category filtering
- Real-time results

### 💰 Pricing & Tax
- Per-unit pricing
- Automatic subtotal calculation
- 18% GST tax calculation
- Total calculation

### 📊 Analytics
- Daily sales tracking
- Top-selling items analysis
- Revenue reports
- Order frequency

### 🖨️ Printing
- Receipt printing
- Invoice generation
- Purchase history
- Reprint capability

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- [ ] Barcode scanning integration
- [ ] Multiple store support
- [ ] User authentication
- [ ] Payment gateway integration
- [ ] PDF export functionality
- [ ] Expense tracking
- [ ] Supplier management
- [ ] Inventory alerts
- [ ] Customer loyalty program
- [ ] Cloud sync

## Notes

- All data is stored locally in the browser
- No backend server required
- Perfect for demonstration and learning
- Can be extended with backend integration

## License

MIT License - Feel free to use and modify as needed.

## Support

For issues or feature requests, please create an issue in the repository.

---

Built with ❤️ using Angular 18
