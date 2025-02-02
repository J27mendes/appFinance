import { IdGeneratorAdapter } from './idGenerator';

describe('idGeneratorAdapter', () => {
  it('should return a random id', async () => {
    const sut = new IdGeneratorAdapter();
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    const result = await sut.execute();

    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result).toMatch(uuidRegex);
  });
});
