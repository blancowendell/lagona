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

//Customer Api 2025-02-08

//#region getMenuSoloImage

/**
 * @swagger
 * /MobileApi/getMenuSoloImage:
 *   post:
 *     summary: Retrieve an image of a solo menu item
 *     description: Returns the image URL of a solo menu item based on the provided item ID.
 *     tags:
 *       - Customer Api 2025-02-08
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
 * /MobileApi/getMenuSolo:
 *   post:
 *     summary: Retrieve available solo menu items for a merchant
 *     description: Returns a list of active solo menu items based on the provided merchant ID.
 *     tags:
 *       - Customer Api 2025-02-08
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
 * /MobileApi/getCombo:
 *   post:
 *     summary: Retrieve available menu combos for a merchant
 *     description: Returns a list of active menu combos based on the provided merchant ID.
 *     tags:
 *       - Customer Api 2025-02-08
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
 * /MobileApi/geComboImage:
 *   post:
 *     summary: Retrieve meal image for a specific combo
 *     description: Returns the image URL for the specified combo ID.
 *     tags:
 *       - Customer Api 2025-02-08
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
 * /MobileApi/getExtra:
 *   post:
 *     summary: Retrieve available menu extras for a merchant
 *     description: Returns a list of active menu extras based on the provided merchant ID.
 *     tags:
 *       - Customer Api 2025-02-08
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
 * /MobileApi/geExtraImage:
 *   post:
 *     summary: Retrieve an extra item image
 *     description: Returns the image of an extra item based on the provided extra ID.
 *     tags:
 *       - Customer Api 2025-02-08
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


//Customer Api 2025-02-11

//#region loadMerchantLimit
/**
 * @swagger
 * /MobileApi/loadMerchantLimit:
 *   post:
 *     summary: Retrieve a list of merchants with a limit
 *     description: Fetches up to 10 merchants from the `master_merchant` table based on the provided `type` if they are active.
 *     tags:
 *       - Customer Api 2025-02-11
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
 * /MobileApi/getCompleteItem:
 *   post:
 *     summary: Retrieve a complete menu item
 *     description: Fetches a specific menu item from the `menu_item` table based on `item_id` if it is available.
 *     tags:
 *       - Customer Api 2025-02-11
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
 * /MobileApi/getCompleteSolo:
 *   post:
 *     summary: Retrieve a complete solo meal
 *     description: Fetches a specific solo meal from the `menu_solo` table based on `solo_id` if it is available.
 *     tags:
 *       - Customer Api 2025-02-11
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
 * /MobileApi/getCompleteCombo:
 *   post:
 *     summary: Retrieve a complete combo meal
 *     description: Fetches a specific combo meal from the `menu_combo` table based on `combo_id` if it is available.
 *     tags:
 *       - Customer Api 2025-02-11
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
 * /MobileApi/getCompleteExtra:
 *   post:
 *     summary: Retrieve a complete extra item
 *     description: Fetches a specific extra item from the `menu_extras` table based on `extra_id` if it is available.
 *     tags:
 *       - Customer Api 2025-02-11
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
 * /MobileApi/getItem:
 *   post:
 *     summary: Retrieve available menu items for a merchant
 *     description: Fetches all active menu items from the `menu_item` table based on `merchant_id`.
 *     tags:
 *       - Customer Api 2025-02-11
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
 * /MobileApi/getItemImage:
 *   post:
 *     summary: Retrieve an item image
 *     description: Fetches the image of a specific menu item from the `menu_item` table based on `item_id`.
 *     tags:
 *       - Customer Api 2025-02-11
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


// Merchant Api 2025-02-12

//#region merchantSignUp

/**
 * @swagger
 * /MobileApi/merchantSignUp:
 *   post:
 *     summary: Merchant sign-up
 *     description: Registers a new merchant with the provided details. Sends an OTP for verification.
 *     tags:
 *       - Merchant Api 2025-02-12
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
 * /MobileApi/verifyOtpMerchant:
 *   post:
 *     summary: Verify merchant OTP
 *     description: Verifies the OTP sent to the merchant's email and activates the account.
 *     tags:
 *       - Merchant Api 2025-02-12
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


// Rider Api 2025-02-12

//#region loadHub

/**
 * @swagger
 * /MobileApi/loadHub:
 *   get:
 *     summary: Load all master hub stations
 *     description: Retrieves a list of all available master hub stations.
 *     tags:
 *       - Rider Api 2025-02-12
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
 * /MobileApi/riderSignUp:
 *   post:
 *     summary: Sign up a new rider
 *     description: Registers a new rider and sends an OTP for verification.
 *     tags:
 *       - Rider Api 2025-02-12
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
 * /MobileApi/verifyOtpRider:
 *   post:
 *     summary: Verify rider's OTP and activate account
 *     description: Verifies the OTP sent to the rider's email and activates the account.
 *     tags:
 *       - Rider Api 2025-02-12
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
 * /MobileApi/requestOtpRider:
 *   put:
 *     summary: Request OTP for rider
 *     description: Generates and updates an OTP for the rider's email.
 *     tags:
 *       - Rider Api 2025-02-12
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