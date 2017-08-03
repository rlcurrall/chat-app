const expect = require('expect');

//import isRealString
const {isRealString} = require('./validation');

//isRealString
  // should reject non-string values
  // should reject string with only spaces
  // should allow string with non space characters

describe('isRealString', ()  => {
  it('should reject non-string values', () => {
    let num = 4;
    let res = isRealString(num);

    expect(res).toBe(false);
  });

  it('should reject string with only spaces', () => {
    let str = '     ';
    let res = isRealString(str);

    expect(res).toBe(false);
  });

  it('should allow string with non-space characters', () => {
    let str = '   hello';
    let res = isRealString(str);

    expect(res).toBe(true);
  });
});
