const express = require('express');

const router = express.Router();

const imageCheck = require('../../services/imageCheck.service');
const uploadController = require('../../controllers/upload.controller');

router.post('/file', imageCheck, uploadController.uploadFile);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: File Upload
 *   description: API endpoints for file upload
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           description: Error code
 *         message:
 *           type: string
 *           description: Error message
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file
 *     tags: [File Upload]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fileUrl:
 *                   type: string
 *                   description: The URL of the uploaded file
 *             example:
 *               fileUrl: https://example.com/uploads/images/filename.jpg
 *       "400":
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 400
 *               message: No file uploaded
 *       "500":
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               code: 500
 *               message: Internal Server Error
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
