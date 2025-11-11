import { BadRequestException } from '@nestjs/common';
import { UserService } from '../src/user/user.service';

describe('UserService', () => {
  function createUserModelMock() {
    const data: any[] = [];
    // a real constructor function to support `new this.userModel(doc)`
    const Model: any = function (this: any, doc: any) {
      Object.assign(this, doc);
      this.save = jest.fn(async () => {
        data.push({ ...doc });
      });
    };
    // findOne(...).lean() support
    // IMPORTANT: findOne must NOT be async, otherwise `.lean()` would be called on a Promise
    Model.findOne = jest.fn((q: any) => ({
      lean: jest.fn(async () => data.find((u) => u.email === q.email) || null),
    }));
    return { Model, data };
  }

  it('registers new user', async () => {
    const { Model } = createUserModelMock();
    const svc = new UserService(Model);
    const dto = { email: 'TEST@EXAMPLE.COM', password: 'secret123' } as any;
    const res = await svc.register(dto);
    expect(res).toEqual({ message: 'User registered successfully.' });
    expect(Model.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
  });

  it('throws on duplicate email', async () => {
    const ExistingModel: any = function () {};
    ExistingModel.findOne = jest.fn(() => ({
      lean: jest.fn(async () => ({ email: 'a@b.com' })),
    }));
    const svc = new UserService(ExistingModel);
    await expect(svc.register({ email: 'a@b.com', password: 'x' } as any)).rejects.toBeInstanceOf(BadRequestException);
  });
});
