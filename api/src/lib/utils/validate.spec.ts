import { requiredPick } from './validate';

describe('requiredPick()', () => {
  const errBase = 'ERROR: Required keys are unset:';
  it('return required keys', async () => {
    expect(
      requiredPick({'foo': '1', 'bar': '2', 'no': 'asdf'}, 'foo', 'bar')
    ).toEqual({'foo': '1', 'bar': '2'});
  });
  it('error on empty string values', async () => {
    expect(() => {
      requiredPick({'foo': ''}, 'foo')
    }).toThrow(`${errBase} foo`);
  });
  it('error on undefined values', async () => {
    expect(() => {
      requiredPick({'foo': undefined}, 'foo')
    }).toThrow(`${errBase} foo`);
  });
});
