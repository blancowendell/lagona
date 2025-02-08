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


//#region getMenuSoloImage

/**
 * @swagger
 * /MobileApi/getMenuSoloImage:
 *   post:
 *     summary: Retrieve an image of a solo menu item
 *     description: Returns the image URL of a solo menu item based on the provided item ID.
 *     tags:
 *       - Menu
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
 *       - Menu
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
 *       - Menu
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
 *       - Menu
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
 *       - Menu
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
 *       - Menu
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
