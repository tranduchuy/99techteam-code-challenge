import { Router } from 'express';
import { body, query } from 'express-validator';
import AppDataSource from '../data-source';
import { Item } from '../domains/Item';
import { ItemService } from '../application/ItemService';
import { createItemController } from './itemController';

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: CRUD operations for items
 */

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Validation error
 *
 *   get:
 *     summary: Get all items
 *     tags: [Items]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by item name
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: Limit the number of results (must be >= 1)
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         required: false
 *         description: Number of items to skip (must be >= 0, for pagination)
 *     responses:
 *       200:
 *         description: List of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 */

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Get an item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Item ID
 *     responses:
 *       200:
 *         description: The item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 *
 *   put:
 *     summary: Update an item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Item not found
 *
 *   delete:
 *     summary: Delete an item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Item ID
 *     responses:
 *       204:
 *         description: Item deleted
 *       404:
 *         description: Item not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const itemRepo = AppDataSource.getRepository(Item);
const itemService = new ItemService(itemRepo);
const controller = createItemController(itemService);

const router = Router();

const itemValidation = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('description').optional().isString(),
];

const getItemsValidation = [
  query('name').optional().isString(),
  query('limit').optional().isInt({ min: 1 }),
  query('offset').optional().isInt({ min: 0 }),
];

router.post('/', itemValidation, controller.createItem);
router.get('/', getItemsValidation, controller.getItems);
router.get('/:id', controller.getItemById);
router.put('/:id', itemValidation, controller.updateItem);
router.delete('/:id', controller.deleteItem);

export default router;
