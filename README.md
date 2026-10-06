# Product CRUD API (Express + MongoDB + Multer)

RESTful Product CRUD API with image upload. Products belong to a Category.

## Setup
```bash
npm install
# create .env (see .env.example) and add your MongoDB Atlas connection string
npm start        # or: npm run dev
```

## Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/categories | Create category (form-data: name, description, optional image) |
| POST | /api/products | Create product (form-data, optional `image` file) |
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get single product |
| PUT | /api/products/:id | Update product (optionally replace the image) |
| DELETE | /api/products/:id | Delete product and remove its image file from disk |

**Product fields (form-data):** `name`*, `category`* (category _id), `price`*, `description`, `stock`, `isActive`, `image` (file)

## Technical requirements
- Multer file filter: only `.png`, `.jpg`, `.jpeg` (extension and MIME type) - `middleware/upload.js`
- `express.static()` serves `/uploads` - `server.js`
- Old image deleted on update, image deleted on product delete, and uploaded file rolled back if saving fails - `controllers/productController.js`
- JSON error handler for invalid file type, file too large (5 MB), invalid ids

## Testing
Import `postman/Product-CRUD-API.postman_collection.json` into Postman and run requests 0 to 6 in order.
