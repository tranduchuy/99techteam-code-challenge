import { ItemService } from '../ItemService';
import { Item } from '../../domains/Item';

type MockRepository = {
  create: jest.Mock;
  save: jest.Mock;
  find: jest.Mock;
  findOneBy: jest.Mock;
  delete: jest.Mock;
};

const mockRepo: MockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  delete: jest.fn(),
};

describe('ItemService', () => {
  let service: ItemService;
  beforeEach(() => {
    jest.clearAllMocks();
    service = new ItemService(
      mockRepo as unknown as import('typeorm').Repository<Item>,
    );
  });

  it('creates and saves an item', async () => {
    const data = { name: 'Test' };
    const item = { ...data } as Item;
    mockRepo.create.mockReturnValue(item);
    mockRepo.save.mockResolvedValue(item);
    const result = await service.create(data);
    expect(mockRepo.create).toHaveBeenCalledWith(data);
    expect(mockRepo.save).toHaveBeenCalledWith(item);
    expect(result).toBe(item);
  });

  it('finds all items', async () => {
    const items = [{ name: 'A' }, { name: 'B' }] as Item[];
    mockRepo.find.mockResolvedValue(items);
    const result = await service.findAll();
    expect(result).toBe(items);
  });

  it('finds items by name', async () => {
    const items = [{ name: 'A' }] as Item[];
    mockRepo.find.mockResolvedValue(items);
    const result = await service.findAll({ name: 'A' });
    expect(mockRepo.find).toHaveBeenCalledWith({
      where: { name: 'A' },
      take: undefined,
      skip: undefined,
      order: { createdAt: 'DESC' },
    });
    expect(result).toBe(items);
  });

  it('finds items with pagination', async () => {
    const items = [{ name: 'B' }] as Item[];
    mockRepo.find.mockResolvedValue(items);
    const result = await service.findAll({ limit: 1, offset: 2 });
    expect(mockRepo.find).toHaveBeenCalledWith({
      where: {},
      take: 1,
      skip: 2,
      order: { createdAt: 'DESC' },
    });
    expect(result).toBe(items);
  });

  it('finds item by id', async () => {
    const item = { id: '1', name: 'A' } as Item;
    mockRepo.findOneBy.mockResolvedValue(item);
    const result = await service.findById('1');
    expect(result).toBe(item);
  });

  it('updates an item if found', async () => {
    const item = { id: '1', name: 'A' } as Item;
    mockRepo.findOneBy.mockResolvedValue(item);
    mockRepo.save.mockResolvedValue({ ...item, name: 'B' });
    const result = await service.update('1', { name: 'B' });
    expect(result).toEqual({ ...item, name: 'B' });
  });

  it('returns null when updating non-existent item', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);
    const result = await service.update('2', { name: 'B' });
    expect(result).toBeNull();
  });

  it('deletes an item and returns true if affected', async () => {
    mockRepo.delete.mockResolvedValue({ affected: 1 });
    const result = await service.delete('1');
    expect(result).toBe(true);
  });

  it('deletes an item and returns false if not affected', async () => {
    mockRepo.delete.mockResolvedValue({ affected: 0 });
    const result = await service.delete('1');
    expect(result).toBe(false);
  });
});
