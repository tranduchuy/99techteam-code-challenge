import { createItemController } from '../itemController';
import { ItemService } from '../../application/ItemService';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { validationResult } from 'express-validator';

jest.mock('../../application/ItemService');
jest.mock('express-validator', () => {
  const original = jest.requireActual('express-validator');
  return {
    ...original,
    validationResult: jest.fn(),
  };
});

beforeAll(() => {
  (validationResult as unknown as jest.Mock).mockImplementation(() => ({
    isEmpty: () => true,
    array: () => [],
  }));
});

describe('itemController', () => {
  let service: jest.Mocked<ItemService>;
  let controller: ReturnType<typeof createItemController>;
  beforeEach(() => {
    service = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ItemService>;
    controller = createItemController(service);
  });

  it('createItem: should return 201 and item', async () => {
    service.create = jest.fn().mockResolvedValue({ id: '1', name: 'A' });
    const req = getMockReq({ body: { name: 'A' } });
    const { res } = getMockRes();
    await controller.createItem(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: '1', name: 'A' });
  });

  it('getItems: should return items', async () => {
    service.findAll = jest.fn().mockResolvedValue([{ id: '1', name: 'A' }]);
    const req = getMockReq();
    const { res } = getMockRes();
    await controller.getItems(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: '1', name: 'A' }]);
  });

  it('getItems: should support filtering by name', async () => {
    service.findAll = jest.fn().mockResolvedValue([{ id: '1', name: 'A' }]);
    const req = getMockReq({ query: { name: 'A' } });
    const { res } = getMockRes();
    await controller.getItems(req, res);
    expect(service.findAll).toHaveBeenCalledWith({
      name: 'A',
      limit: undefined,
      offset: undefined,
    });
    expect(res.json).toHaveBeenCalledWith([{ id: '1', name: 'A' }]);
  });

  it('getItems: should support pagination', async () => {
    service.findAll = jest.fn().mockResolvedValue([{ id: '2', name: 'B' }]);
    const req = getMockReq({ query: { limit: '1', offset: '1' } });
    const { res } = getMockRes();
    await controller.getItems(req, res);
    expect(service.findAll).toHaveBeenCalledWith({
      name: undefined,
      limit: 1,
      offset: 1,
    });
    expect(res.json).toHaveBeenCalledWith([{ id: '2', name: 'B' }]);
  });

  it('getItems: should return 400 for invalid limit', async () => {
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [
        { msg: 'Invalid limit', param: 'limit', location: 'query' },
      ],
    });
    const req = getMockReq({ query: { limit: '0' } });
    const { res } = getMockRes();
    await controller.getItems(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.any(Array) }),
    );
  });

  it('getItems: should return 400 for invalid offset', async () => {
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [
        { msg: 'Invalid offset', param: 'offset', location: 'query' },
      ],
    });
    const req = getMockReq({ query: { offset: '-1' } });
    const { res } = getMockRes();
    await controller.getItems(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.any(Array) }),
    );
  });

  it('getItems: should return 400 for invalid name type', async () => {
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{ msg: 'Invalid name', param: 'name', location: 'query' }],
    });
    const req = getMockReq({ query: { name: ['foo', 'bar'] } });
    const { res } = getMockRes();
    await controller.getItems(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.any(Array) }),
    );
  });

  it('getItemById: should return item if found', async () => {
    service.findById = jest.fn().mockResolvedValue({ id: '1', name: 'A' });
    const req = getMockReq({ params: { id: '1' } });
    const { res } = getMockRes();
    await controller.getItemById(req, res);
    expect(res.json).toHaveBeenCalledWith({ id: '1', name: 'A' });
  });

  it('getItemById: should return 404 if not found', async () => {
    service.findById = jest.fn().mockResolvedValue(null);
    const req = getMockReq({ params: { id: '2' } });
    const { res } = getMockRes();
    await controller.getItemById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Item not found' });
  });

  it('updateItem: should return updated item', async () => {
    service.update = jest.fn().mockResolvedValue({ id: '1', name: 'B' });
    const req = getMockReq({ body: { name: 'B' }, params: { id: '1' } });
    const { res } = getMockRes();
    await controller.updateItem(req, res);
    expect(res.json).toHaveBeenCalledWith({ id: '1', name: 'B' });
  });

  it('updateItem: should return 404 if not found', async () => {
    service.update = jest.fn().mockResolvedValue(null);
    const req = getMockReq({ body: { name: 'B' }, params: { id: '2' } });
    const { res } = getMockRes();
    await controller.updateItem(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Item not found' });
  });

  it('deleteItem: should return 204 if deleted', async () => {
    service.delete = jest.fn().mockResolvedValue(true);
    const req = getMockReq({ params: { id: '1' } });
    const { res } = getMockRes();
    await controller.deleteItem(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });

  it('deleteItem: should return 404 if not found', async () => {
    service.delete = jest.fn().mockResolvedValue(false);
    const req = getMockReq({ params: { id: '2' } });
    const { res } = getMockRes();
    await controller.deleteItem(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Item not found' });
  });
});
