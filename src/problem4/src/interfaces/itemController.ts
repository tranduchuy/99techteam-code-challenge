import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ItemService } from '../application/ItemService';

export function createItemController(itemService: ItemService) {
  return {
    createItem: async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
        const item = await itemService.create(req.body);
        res.status(201).json(item);
      } catch (err) {
        res.status(400).json({ error: 'Failed to create item', details: err });
      }
    },
    getItems: async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { name, limit, offset } = req.query;
      const items = await itemService.findAll({
        name: typeof name === 'string' ? name : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        offset: offset ? parseInt(offset as string, 10) : undefined,
      });
      res.json(items);
    },
    getItemById: async (req: Request, res: Response) => {
      const item = await itemService.findById(req.params.id);
      if (!item) return res.status(404).json({ error: 'Item not found' });
      res.json(item);
    },
    updateItem: async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const item = await itemService.update(req.params.id, req.body);
      if (!item) return res.status(404).json({ error: 'Item not found' });
      res.json(item);
    },
    deleteItem: async (req: Request, res: Response) => {
      const success = await itemService.delete(req.params.id);
      if (!success) return res.status(404).json({ error: 'Item not found' });
      res.status(204).send();
    },
  };
}
