import { Item } from '../Item';

describe('Item entity', () => {
  it('should create an Item with given properties', () => {
    const now = new Date();
    const item = new Item();
    item.id = '123';
    item.name = 'Test';
    item.description = 'Desc';
    item.createdAt = now;
    item.updatedAt = now;
    expect(item.id).toBe('123');
    expect(item.name).toBe('Test');
    expect(item.description).toBe('Desc');
    expect(item.createdAt).toBe(now);
    expect(item.updatedAt).toBe(now);
  });
});
