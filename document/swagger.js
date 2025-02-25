const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LAGONA-EXPRESS API Documentation",
      version: "1.0.0",
      description: "API documentation for Mobile App",
    },
  },
  apis: ["./document/*.js"], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;

//#region Customer Api

//#region getMenuSoloImage

/**
 * @swagger
 * /CustomerAppApi/getMenuSoloImage:
 *   post:
 *     summary: Retrieve an image of a solo menu item
 *     description: Returns the image URL of a solo menu item based on the provided item ID.
 *     tags:
 *       - Customer Api
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               item_id:
 *                 type: string
 *                 example: "1"
 *                 description: The unique identifier of the solo menu item.
 *     responses:
 *       200:
 *         description: Successfully retrieved the solo menu item image.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     solo_id:
 *                       type: integer
 *                       example: 1
 *                     meal_image:
 *                       type: string
 *                       example: "https://example.com/images/solo1.jpg"
 *       400:
 *         description: Invalid request or missing parameters.
 *       500:
 *         description: Server error.
 */
//#endregion


//#region getMenuSolo
/**
 * @swagger
 * /CustomerAppApi/getMenuSolo:
 *   post:
 *     summary: Retrieve available solo menu items for a merchant
 *     description: Returns a list of active solo menu items based on the provided merchant ID.
 *     tags:
 *       - Customer Api
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               merchant_id:
 *                 type: string
 *                 example: "1"
 *                 description: The unique identifier of the merchant.
 *     responses:
 *       200:
 *         description: Successfully retrieved solo menu items.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       solo_id:
 *                         type: integer
 *                         example: 1
 *                       solo_name:
 *                         type: string
 *                         example: "Solo Meal 1"
 *                       description:
 *                         type: string
 *                         example: "A delicious solo meal"
 *                       price:
 *                         type: number
 *                         example: 9.99
 *       400:
 *         description: Invalid request or missing parameters.
 *       500:
 *         description: Server error.
 */
//#endregion


//#region getCombo

/**
 * @swagger
 * /CustomerAppApi/getCombo:
 *   post:
 *     summary: Retrieve available menu combos for a merchant
 *     description: Returns a list of active menu combos based on the provided merchant ID.
 *     tags:
 *       - Customer Api 
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               merchant_id:
 *                 type: string
 *                 example: "1"
 *                 description: The unique identifier of the merchant.
 *     responses:
 *       200:
 *         description: Successfully retrieved menu combos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       combo_id:
 *                         type: integer
 *                         example: 1
 *                       combo_name:
 *                         type: string
 *                         example: "Combo 1"
 *                       description:
 *                         type: string
 *                         example: "A delicious meal for the whole family"
 *                       price:
 *                         type: number
 *                         example: 19.99
 *       400:
 *         description: Invalid request or missing parameters.
 *       500:
 *         description: Server error.
 */


//#endregion


//#region geComboImage
/**
 * @swagger
 * /CustomerAppApi/geComboImage:
 *   post:
 *     summary: Retrieve meal image for a specific combo
 *     description: Returns the image URL for the specified combo ID.
 *     tags:
 *       - Customer Api 
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               combo_id:
 *                 type: string
 *                 example: "1"
 *                 description: The unique identifier of the combo.
 *     responses:
 *       200:
 *         description: Successfully retrieved the combo image.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       combo_id:
 *                         type: integer
 *                         example: 1
 *                       meal_image:
 *                         type: string
 *                         example: "https://example.com/images/combo1.jpg"
 *       400:
 *         description: Invalid request or missing parameters.
 *       500:
 *         description: Server error.
 */
//#endregion


//#region getExtra
/**
 * @swagger
 * /CustomerAppApi/getExtra:
 *   post:
 *     summary: Retrieve available menu extras for a merchant
 *     description: Returns a list of active menu extras based on the provided merchant ID.
 *     tags:
 *       - Customer Api 
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               merchant_id:
 *                 type: string
 *                 example: "1"
 *                 description: The unique identifier of the merchant.
 *     responses:
 *       200:
 *         description: Successfully retrieved menu extras.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       extra_id:
 *                         type: integer
 *                         example: 1
 *                       extra_name:
 *                         type: string
 *                         example: "Cheese"
 *                       description:
 *                         type: string
 *                         example: "Extra cheese for your meal"
 *                       extra_price:
 *                         type: number
 *                         example: 2.99
 *       400:
 *         description: Invalid request or missing parameters.
 *       500:
 *         description: Server error.
 */
//#endregion


//#region geExtraImage
/**
 * @swagger
 * /CustomerAppApi/geExtraImage:
 *   post:
 *     summary: Retrieve an extra item image
 *     description: Returns the image of an extra item based on the provided extra ID.
 *     tags:
 *       - Customer Api 
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               combo_id:
 *                 type: string
 *                 example: "1"
 *                 description: The unique identifier of the extra item.
 *     responses:
 *       200:
 *         description: Successfully retrieved the extra item image.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     extra_id:
 *                       type: integer
 *                       example: 1
 *                     extra_image:
 *                       type: string
 *                       example: "https://example.com/images/extra1.jpg"
 *       400:
 *         description: Invalid request or missing parameters.
 *       500:
 *         description: Server error.
 */
//#endregion


//#region loadMerchantLimit
/**
 * @swagger
 * /CustomerAppApi/loadMerchantLimit:
 *   post:
 *     summary: Retrieve a list of merchants with a limit
 *     description: Fetches up to 10 merchants from the `master_merchant` table based on the provided `type` if they are active.
 *     tags:
 *       - Customer Api 
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "Restaurant"
 *     responses:
 *       200:
 *         description: Successfully retrieved merchant list.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     example:
 *                       merchant_id: "1"
 *                       merchant_code: "M123"
 *                       business_name: "Burger House"
 *                       business_branch: "Downtown"
 *       500:
 *         description: Internal server error
 */
//#endregion


//#region getCompleteItem

/**
 * @swagger
 * /CustomerAppApi/getCompleteItem:
 *   post:
 *     summary: Retrieve a complete menu item
 *     description: Fetches a specific menu item from the `menu_item` table based on `item_id` if it is available.
 *     tags:
 *       - Customer Api 
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               item_id:
 *                 type: string
 *                 example: "123"
 *     responses:
 *       200:
 *         description: Successfully retrieved item details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     example:
 *                       item_id: "123"
 *                       name: "Burger"
 *                       price: 5.99
 *                       is_available: "Active"
 *       500:
 *         description: Internal server error
 */

//#endregion


//#region getCompleteSolo

/**
 * @swagger
 * /CustomerAppApi/getCompleteSolo:
 *   post:
 *     summary: Retrieve a complete solo meal
 *     description: Fetches a specific solo meal from the `menu_solo` table based on `solo_id` if it is available.
 *     tags:
 *       - Customer Api 
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               solo_id:
 *                 type: string
 *                 example: "456"
 *     responses:
 *       200:
 *         description: Successfully retrieved solo meal details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     example:
 *                       solo_id: "456"
 *                       name: "Chicken Meal"
 *                       price: 7.99
 *                       is_available: "Active"
 *       500:
 *         description: Internal server error
 */

//#endregion


//#region getCompleteCombo

/**
 * @swagger
 * /CustomerAppApi/getCompleteCombo:
 *   post:
 *     summary: Retrieve a complete combo meal
 *     description: Fetches a specific combo meal from the `menu_combo` table based on `combo_id` if it is available.
 *     tags:
 *       - Customer Api 
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               combo_id:
 *                 type: string
 *                 example: "789"
 *     responses:
 *       200:
 *         description: Successfully retrieved combo meal details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     example:
 *                       combo_id: "789"
 *                       name: "Family Meal"
 *                       price: 19.99
 *                       is_available: "Active"
 *       500:
 *         description: Internal server error
 */

//#endregion


//#region getCompleteExtra

/**
 * @swagger
 * /CustomerAppApi/getCompleteExtra:
 *   post:
 *     summary: Retrieve a complete extra item
 *     description: Fetches a specific extra item from the `menu_extras` table based on `extra_id` if it is available.
 *     tags:
 *       - Customer Api 
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               extra_id:
 *                 type: string
 *                 example: "321"
 *     responses:
 *       200:
 *         description: Successfully retrieved extra item details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     example:
 *                       extra_id: "321"
 *                       name: "Cheese Slice"
 *                       price: 0.99
 *                       is_available: "Active"
 *       500:
 *         description: Internal server error
 */

//#endregion


//#region getItem

/**
 * @swagger
 * /CustomerAppApi/getItem:
 *   post:
 *     summary: Retrieve available menu items for a merchant
 *     description: Fetches all active menu items from the `menu_item` table based on `merchant_id`.
 *     tags:
 *       - Customer Api 
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               merchant_id:
 *                 type: string
 *                 example: "1001"
 *     responses:
 *       200:
 *         description: Successfully retrieved menu items.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     example:
 *                       item_id: "10"
 *                       item_name: "Cheese Burger"
 *                       name: "Regular"
 *                       category: "Burgers"
 *                       item_price: 5.99
 *                       description: "Juicy grilled burger with melted cheese"
 *       500:
 *         description: Internal server error
 */

//#endregion


//#region getItemImage

/**
 * @swagger
 * /CustomerAppApi/getItemImage:
 *   post:
 *     summary: Retrieve an item image
 *     description: Fetches the image of a specific menu item from the `menu_item` table based on `item_id`.
 *     tags:
 *       - Customer Api 
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               item_id:
 *                 type: string
 *                 example: "10"
 *     responses:
 *       200:
 *         description: Successfully retrieved item image.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     example:
 *                       item_id: "10"
 *                       item_image: "https://example.com/images/cheese_burger.jpg"
 *       500:
 *         description: Internal server error
 */

//#endregion


//#region loginCustomer

/**
 * @swagger
 * /CustomerAppApi/loginCustomer:
 *   post:
 *     summary: Customer login
 *     description: Authenticates a customer and returns a JWT token upon successful login.
 *     tags:
 *       - Customer Api 
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "customer123"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     cus_id:
 *                       type: integer
 *                       example: 1
 *                     cus_fullname:
 *                       type: string
 *                       example: "John Doe"
 *                     role_type:
 *                       type: string
 *                       example: "Customer"
 *                     token:
 *                       type: string
 *                       example: "encrypted_jwt_token_here"
 *       401:
 *         description: Incorrect username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "incorrect"
 *       403:
 *         description: Account is inactive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "inactive"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "error"
 *                 data:
 *                   type: string
 *                   example: "Detailed error message here"
 */

//#endregion


//#region Add Customer Address

/**
 * @swagger
 * /CustomerAppApi/addAddress:
 *   post:
 *     summary: Add a new address for a customer
 *     description: Adds a new address to the customer's address list. Requires JWT authentication.
 *     tags:
 *       - Customer Api
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: integer
 *                 example: 123
 *               address:
 *                 type: string
 *                 example: "123 Main St, Springfield"
 *               geo_code:
 *                 type: string
 *                 example: "SP123"
 *               latitude:
 *                 type: number
 *                 format: float
 *                 example: 37.7749
 *               longitude:
 *                 type: number
 *                 format: float
 *                 example: -122.4194
 *               type:
 *                 type: string
 *                 example: "Home"
 *     responses:
 *       200:
 *         description: Address added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "success"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "error"
 *                 data:
 *                   type: string
 *                   example: "Detailed error message"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Unauthorized"
 */

//#endregion


//#region customerCheckout

/**
 * @swagger
 * /CustomerAppApi/customerCheckout:
 *   post:
 *     summary: Create a new order
 *     description: Endpoint to create a new order in the system.
 *     tags:
 *       - Customer Api
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               merchant_id:
 *                 type: integer
 *                 example: 1
 *               customer_id:
 *                 type: integer
 *                 example: 1
 *               order_type:
 *                 type: string
 *                 example: "Online Payment"
 *               lagona_fee:
 *                 type: number
 *                 format: float
 *                 example: 10.5
 *               order_total:
 *                 type: number
 *                 format: float
 *                 example: 150.75
 *               address_id:
 *                 type: integer
 *                 example: 1
 *               order_note:
 *                 type: string
 *                 example: "Please deliver between 5-6 PM."
 *               delivery_fee:
 *                 type: number
 *                 format: float
 *                 example: 15.0
 *               order_fee:
 *                 type: number
 *                 format: float
 *                 example: 5.0
 *               order_details:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     category:
 *                       type: string
 *                       example: "Item"
 *                     product_id:
 *                       type: integer
 *                       example: 49
 *                     quantity:
 *                       type: integer
 *                       example: 3
 *           example:
 *             merchant_id: 1
 *             customer_id: 1
 *             order_type: "Online Payment"
 *             lagona_fee: 10.5
 *             order_total: 150.75
 *             address_id: 1
 *             order_note: "Please deliver between 5-6 PM."
 *             delivery_fee: 15.0
 *             order_fee: 5.0
 *             order_details:
 *               - category: "Item"
 *                 product_id: 49
 *                 quantity: 3
 *     responses:
 *       200:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Order placed successfully"
 *                 order_id:
 *                   type: integer
 *                   example: 101
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "All fields are required and order_details must be a non-empty array"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to create order"
 */

//#endregion


//#region getPaymentQrCode

/**
 * @swagger
 * /CustomerAppApi/getPaymentQrCode:
 *   post:
 *     summary: Retrieve payment QR code for a customer
 *     description: Returns the business name, payment QR code, merchant code, and order total for a customer's pending order.
 *     tags:
 *       - Customer Api
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: string
 *                 example: "12345"
 *                 description: The unique identifier of the customer.
 *     responses:
 *       200:
 *         description: Successfully retrieved payment details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     mm_business_name:
 *                       type: string
 *                       example: "ABC Store"
 *                     mm_payment_qr_code:
 *                       type: string
 *                       example: "https://example.com/qr/abcstore.png"
 *                     mm_merchant_code:
 *                       type: string
 *                       example: "ABC123"
 *                     mm_total:
 *                       type: number
 *                       format: float
 *                       example: 150.75
 *                     mm_del_fee:
 *                       type: number
 *                       format: float
 *                       example: 150.75
 *       400:
 *         description: Invalid request or missing parameters.
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Server error.
 */

//#endregion


//#region sendPayment

/**
 * @swagger
 * /CustomerAppApi/sendPayment:
 *   put:
 *     summary: Submit payment for an order
 *     description: Allows a customer to submit a base64-encoded payment screenshot for a specific order. Requires JWT authentication.
 *     tags:
 *       - Customer Api
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id:
 *                 type: string
 *                 description: The unique identifier of the order.
 *                 example: "12345"
 *               payment_screenshots:
 *                 type: string
 *                 format: byte
 *                 description: The base64-encoded payment screenshot.
 *                 example: "iVBORw0KGgoAAAANSUhEUgAA..."
 *             required:
 *               - order_id
 *               - payment_screenshots
 *     responses:
 *       200:
 *         description: Payment information updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Payment information updated successfully."
 *       400:
 *         description: Bad request. Order ID and payment screenshots are required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Order ID and payment screenshots are required."
 *       404:
 *         description: Order not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Order not found."
 *       409:
 *         description: Payment has already been made for this order.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "warning"
 *                 message:
 *                   type: string
 *                   example: "Payment has already been made for this order."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */

//#endregion


//#endregion

//#region Merchant Api

//#region merchantSignUp

/**
 * @swagger
 * /MerchantAppApi/merchantSignUp:
 *   post:
 *     summary: Merchant sign-up
 *     description: Registers a new merchant with the provided details. Sends an OTP for verification.
 *     tags:
 *       - Merchant Api 
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - merchant_type
 *               - merchant_owner
 *               - business_name
 *               - business_branch
 *               - mobile
 *               - email
 *               - username
 *               - password
 *               - merchant_address
 *             properties:
 *               merchant_type:
 *                 type: string
 *                 example: "Food"
 *               merchant_owner:
 *                 type: string
 *                 example: "John Doe"
 *               business_name:
 *                 type: string
 *                 example: "John's Burgers"
 *               business_branch:
 *                 type: string
 *                 example: "Downtown"
 *               logo:
 *                 type: string
 *                 format: binary
 *                 example: "logo.png"
 *               mobile:
 *                 type: string
 *                 example: "+1234567890"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securePassword123"
 *               merchant_address:
 *                 type: string
 *                 example: "123 Main St, New York"
 *               merchant_geo_code:
 *                 type: string
 *                 example: "40.7128,-74.0060"
 *               latitude:
 *                 type: string
 *                 example: "40.7128"
 *               longitude:
 *                 type: string
 *                 example: "-74.0060"
 *               payment_qr_code:
 *                 type: string
 *                 example: "https://example.com/qrcode"
 *     responses:
 *       200:
 *         description: Merchant registered successfully. OTP sent to email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: OTP sent to email
 *       400:
 *         description: Email or merchant already exists.
 *       500:
 *         description: Internal server error
 */

//#endregion

//#region verifyOtpMerchant

/**
 * @swagger
 * /MerchantAppApi/verifyOtpMerchant:
 *   post:
 *     summary: Verify merchant OTP
 *     description: Verifies the OTP sent to the merchant's email and activates the account.
 *     tags:
 *       - Merchant Api 
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               otp:
 *                 type: string
 *                 example: "6vj0t"
 *     responses:
 *       200:
 *         description: Merchant account activated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Your account has been activated
 *       400:
 *         description: Invalid OTP or email.
 *       500:
 *         description: Internal server error
 */

//#endregion

//#endregion

//#region Rider Api 

//#region loadHub

/**
 * @swagger
 * /RiderAppApi/loadHub:
 *   get:
 *     summary: Load all master hub stations
 *     description: Retrieves a list of all available master hub stations.
 *     tags:
 *       - Rider Api 
 *     responses:
 *       200:
 *         description: List of master hub stations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       hub_id:
 *                         type: integer
 *                       hub_name:
 *                         type: string
 *                       hub_code:
 *                         type: string
 *                       hub_address:
 *                         type: string
 *       400:
 *         description: Error response
 */

//#endregion

//#region riderSignUp

/**
 * @swagger
 * /RiderAppApi/riderSignUp:
 *   post:
 *     summary: Sign up a new rider
 *     description: Registers a new rider and sends an OTP for verification.
 *     tags:
 *       - Rider Api 
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - mobile
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "John"
 *               middle_name:
 *                 type: string
 *                 example: "A."
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *               address:
 *                 type: string
 *                 example: "123 Street, City"
 *               mobile:
 *                 type: string
 *                 example: "9876543210"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *               selfie:
 *                 type: string
 *                 format: binary
 *                 example: "selfie.jpg"
 *               driver_license:
 *                 type: string
 *                 format: binary
 *                 example: "license.jpg"
 *               original_certificate:
 *                 type: string
 *                 format: binary
 *                 example: "certificate.jpg"
 *               certificate_of_registration:
 *                 type: string
 *                 format: binary
 *                 example: "registration.jpg"
 *               vehicle_image:
 *                 type: string
 *                 format: binary
 *                 example: "vehicle.jpg"
 *               vehicle_type:
 *                 type: string
 *                 example: "Motorcycle"
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *                 example: "Male"
 *               license_code:
 *                 type: string
 *                 example: "123456789"
 *     responses:
 *       200:
 *         description: Rider registered successfully and OTP sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: OTP sent successfully
 *       400:
 *         description: Validation error or existing rider/email
 */

//#endregion

//#region verifyOtpRider

/**
 * @swagger
 * /RiderAppApi/verifyOtpRider:
 *   post:
 *     summary: Verify rider's OTP and activate account
 *     description: Verifies the OTP sent to the rider's email and activates the account.
 *     tags:
 *       - Rider Api 
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               otp:
 *                 type: string
 *                 example: "6vj0t"
 *     responses:
 *       200:
 *         description: Rider account activated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Your account has been activated
 *       400:
 *         description: Invalid OTP or email.
 *       500:
 *         description: Internal server error
 */

//#endregion

//#region requestOtpRider

/** 
 * @swagger
 * /RiderAppApi/requestOtpRider:
 *   put:
 *     summary: Request OTP for rider
 *     description: Generates and updates an OTP for the rider's email.
 *     tags:
 *       - Rider Api 
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "rider@example.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: OTP has been sent to your email
 *       400:
 *         description: Invalid email or OTP generation failed.
 *       500:
 *         description: Internal server error
 */

//#endregion

//#region Rider Login

/**
 * @swagger
 * /RiderAppApi/riderLogin:
 *   post:
 *     summary: Rider login
 *     description: Authenticates a rider using username and password, returning a JWT token upon successful login.
 *     tags:
 *       - Rider Api 
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "rider123"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     rider_id:
 *                       type: integer
 *                       example: 1
 *                     rider_fullname:
 *                       type: string
 *                       example: "John Doe"
 *                     role_type:
 *                       type: string
 *                       example: "Rider"
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Incorrect username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "incorrect"
 *       403:
 *         description: Rider account is inactive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "inactive"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "error"
 *                 data:
 *                   type: string
 *                   example: "Detailed error message"
 */

//#endregion

//#region Rider Location

/**
 * @swagger
 * /RiderAppApi/getLocation:
 *   put:
 *     summary: Update rider's location
 *     description: Updates the latitude and longitude of a rider based on their ID.
 *     tags:
 *       - Rider Api 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: number
 *                 description: Latitude of the rider's location.
 *                 example: 14.5528
 *               longitude:
 *                 type: number
 *                 description: Longitude of the rider's location.
 *                 example: 121.0198
 *               rider_id:
 *                 type: integer
 *                 description: Unique identifier of the rider.
 *                 example: 123
 *     responses:
 *       200:
 *         description: Location updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Location updated successfully."
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid input data."
 */

//#endregion

//#endregion