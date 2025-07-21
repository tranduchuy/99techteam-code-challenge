import { Repository, FindOptionsWhere } from 'typeorm';
import { Item } from '../domains/Item';

export class ItemService {
  constructor(private itemRepo: Repository<Item>) {}

  async create(data: Partial<Item>): Promise<Item> {
    const item = this.itemRepo.create(data);
    return this.itemRepo.save(item);
  }

  async findAll(options?: {
    name?: string;
    limit?: number;
    offset?: number;
  }): Promise<Item[]> {
    const { name, limit, offset } = options || {};
    const where: FindOptionsWhere<Item> = {};
    if (name) {
      where.name = name;
    }
    return this.itemRepo.find({
      where,
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Item | null> {
    return this.itemRepo.findOneBy({ id });
  }

  async update(id: string, data: Partial<Item>): Promise<Item | null> {
    const item = await this.findById(id);
    if (!item) return null;
    Object.assign(item, data);
    return this.itemRepo.save(item);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.itemRepo.delete(id);
    return result.affected === 1;
  }
}
