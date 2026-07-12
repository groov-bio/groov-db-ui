import {
  alphaNumericValidation,
  alphaValidation,
  numericValidation,
  emailValidation,
  passwordValidation,
  aboutValidation,
  refseqValidation,
  doiValidation,
  figureValidation,
  dnaValidation,
  smilesValidation,
} from './Validations';

describe('alphaNumericValidation', () => {
  describe('valid inputs', () => {
    it('should match alphanumeric strings with underscores', () => {
      expect(alphaNumericValidation.test('test123')).toBe(true);
      expect(alphaNumericValidation.test('ABC_123')).toBe(true);
      expect(alphaNumericValidation.test('_test_')).toBe(true);
      expect(alphaNumericValidation.test('a')).toBe(true);
      expect(alphaNumericValidation.test('1')).toBe(true);
      expect(alphaNumericValidation.test('_')).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should not match strings with spaces', () => {
      expect(alphaNumericValidation.test('test 123')).toBe(false);
    });

    it('should not match strings with special characters', () => {
      expect(alphaNumericValidation.test('test-123')).toBe(false);
      expect(alphaNumericValidation.test('test.123')).toBe(false);
      expect(alphaNumericValidation.test('test@123')).toBe(false);
    });

    it('should not match empty string', () => {
      expect(alphaNumericValidation.test('')).toBe(false);
    });
  });
});

describe('alphaValidation', () => {
  describe('valid inputs', () => {
    it('should match alphanumeric strings with dashes and apostrophes', () => {
      expect(alphaValidation.test('hello-world')).toBe(true);
      expect(alphaValidation.test("it's")).toBe(true);
      expect(alphaValidation.test('test123')).toBe(true);
      expect(alphaValidation.test('ABC')).toBe(true);
      expect(alphaValidation.test('a')).toBe(true);
      expect(alphaValidation.test("O'Brien")).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should not match strings with underscores', () => {
      expect(alphaValidation.test('test_123')).toBe(false);
    });

    it('should not match strings with spaces', () => {
      expect(alphaValidation.test('hello world')).toBe(false);
    });

    it('should not match strings with other special characters', () => {
      expect(alphaValidation.test('test@123')).toBe(false);
      expect(alphaValidation.test('test.com')).toBe(false);
    });

    it('should not match empty string', () => {
      expect(alphaValidation.test('')).toBe(false);
    });
  });
});

describe('numericValidation', () => {
  describe('valid inputs', () => {
    it('should match pure numeric strings', () => {
      expect(numericValidation.test('123')).toBe(true);
      expect(numericValidation.test('0')).toBe(true);
      expect(numericValidation.test('9999')).toBe(true);
      expect(numericValidation.test('1')).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should not match strings with letters', () => {
      expect(numericValidation.test('123abc')).toBe(false);
      expect(numericValidation.test('abc123')).toBe(false);
    });

    it('should not match strings with special characters', () => {
      expect(numericValidation.test('123-456')).toBe(false);
      expect(numericValidation.test('123.45')).toBe(false);
    });

    it('should not match empty string', () => {
      expect(numericValidation.test('')).toBe(false);
    });

    it('should not match strings with spaces', () => {
      expect(numericValidation.test('123 456')).toBe(false);
    });
  });
});

describe('emailValidation', () => {
  describe('valid inputs', () => {
    it('should match standard email addresses', () => {
      expect(emailValidation.test('user@example.com')).toBe(true);
      expect(emailValidation.test('test.user@example.com')).toBe(true);
      expect(emailValidation.test('test+tag@example.co.uk')).toBe(true);
      expect(emailValidation.test('user@example-domain.com')).toBe(true);
      expect(emailValidation.test('a@b.co')).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should not match emails without @ symbol', () => {
      expect(emailValidation.test('userexample.com')).toBe(false);
    });

    it('should not match emails without domain', () => {
      expect(emailValidation.test('user@')).toBe(false);
    });

    it('should not match emails without extension', () => {
      expect(emailValidation.test('user@example')).toBe(false);
    });

    it('should not match emails with spaces', () => {
      expect(emailValidation.test('user @example.com')).toBe(false);
      expect(emailValidation.test('user@ example.com')).toBe(false);
    });

    it('should not match empty string', () => {
      expect(emailValidation.test('')).toBe(false);
    });

    it('should not match multiple @ symbols', () => {
      expect(emailValidation.test('user@@example.com')).toBe(false);
    });
  });
});

describe('passwordValidation', () => {
  describe('valid inputs', () => {
    it('should match passwords with 8+ chars, uppercase, lowercase, and digit', () => {
      expect(passwordValidation.test('Password123')).toBe(true);
      expect(passwordValidation.test('MyPass1234')).toBe(true);
      expect(passwordValidation.test('Abc123xyz')).toBe(true);
      expect(passwordValidation.test('A1abcdefg')).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should not match passwords less than 8 characters', () => {
      expect(passwordValidation.test('Pass123')).toBe(false);
      expect(passwordValidation.test('Abc1')).toBe(false);
    });

    it('should not match passwords without uppercase', () => {
      expect(passwordValidation.test('password123')).toBe(false);
    });

    it('should not match passwords without lowercase', () => {
      expect(passwordValidation.test('PASSWORD123')).toBe(false);
    });

    it('should not match passwords without digit', () => {
      expect(passwordValidation.test('PasswordABC')).toBe(false);
    });

    it('should not match passwords with only one requirement', () => {
      expect(passwordValidation.test('12345678')).toBe(false);
      expect(passwordValidation.test('abcdefgh')).toBe(false);
      expect(passwordValidation.test('ABCDEFGH')).toBe(false);
    });

    it('should not match empty string', () => {
      expect(passwordValidation.test('')).toBe(false);
    });
  });
});

describe('aboutValidation', () => {
  describe('valid inputs', () => {
    it('should match alphanumeric with allowed special characters', () => {
      expect(aboutValidation.test('This is a test.')).toBe(true);
      expect(aboutValidation.test('Test-string_123')).toBe(true);
      expect(aboutValidation.test('Hello, world!')).toBe(false); // ! is not allowed
    });

    it('should match allowed punctuation', () => {
      expect(aboutValidation.test('test()content')).toBe(true);
      expect(aboutValidation.test('test, test')).toBe(true);
      expect(aboutValidation.test('test. test')).toBe(true);
      expect(aboutValidation.test('test/test')).toBe(true);
      expect(aboutValidation.test('test"test')).toBe(true);
      expect(aboutValidation.test("test'test")).toBe(true);
      expect(aboutValidation.test('test:test')).toBe(true);
      expect(aboutValidation.test('test;test')).toBe(true);
      expect(aboutValidation.test('test test')).toBe(true);
    });

    it('should match strings with allowed characters', () => {
      expect(aboutValidation.test('ABC')).toBe(true);
      expect(aboutValidation.test('123')).toBe(true);
      expect(aboutValidation.test('test-test')).toBe(true);
      expect(aboutValidation.test('test_test')).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should not match strings with @ symbol', () => {
      expect(aboutValidation.test('test@example')).toBe(false);
    });

    it('should not match strings with # symbol', () => {
      expect(aboutValidation.test('test#hash')).toBe(false);
    });

    it('should not match strings with exclamation mark', () => {
      expect(aboutValidation.test('test!')).toBe(false);
    });
  });
});

describe('refseqValidation', () => {
  describe('valid inputs', () => {
    it('should match RefSeq ID format', () => {
      expect(refseqValidation.test('NM_000001')).toBe(true);
      expect(refseqValidation.test('NP_000001')).toBe(true);
      expect(refseqValidation.test('NC_000001')).toBe(true);
    });

    it('should match RefSeq with version numbers', () => {
      expect(refseqValidation.test('NM_000001.1')).toBe(true);
      expect(refseqValidation.test('NM_000001-1')).toBe(true);
      expect(refseqValidation.test('NM_000001.999')).toBe(true);
    });

    it('should match RefSeq with multiple version separators', () => {
      expect(refseqValidation.test('NM_000001.1.2')).toBe(true);
      expect(refseqValidation.test('NM_000001-1-2')).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should not match RefSeq with consecutive separators', () => {
      expect(refseqValidation.test('NM--000001')).toBe(false);
      expect(refseqValidation.test('NM..000001')).toBe(false);
    });

    it('should not match RefSeq starting with dash or period', () => {
      expect(refseqValidation.test('.NM_000001')).toBe(false);
      expect(refseqValidation.test('-NM_000001')).toBe(false);
    });

    it('should not match strings with other special characters', () => {
      expect(refseqValidation.test('NM_000@001')).toBe(false);
      expect(refseqValidation.test('NM 000001')).toBe(false);
    });
  });
});

describe('doiValidation', () => {
  describe('valid inputs', () => {
    it('should match DOI with doi: prefix', () => {
      expect(doiValidation.test('doi:10.1234/example')).toBe(true);
    });

    it('should match DOI with https://doi.org/ prefix', () => {
      expect(doiValidation.test('https://doi.org/10.1234/example')).toBe(true);
    });

    it('should match DOI with http://doi.org/ prefix', () => {
      expect(doiValidation.test('http://doi.org/10.1234/example')).toBe(true);
    });

    it('should match DOI with doi.org/ prefix', () => {
      expect(doiValidation.test('doi.org/10.1234/example')).toBe(true);
    });

    it('should match DOI without prefix (just 10.xxxx format)', () => {
      expect(doiValidation.test('10.1234/example')).toBe(true);
      expect(doiValidation.test('10.12345/test-case_2023')).toBe(true);
    });

    it('should match DOI with special characters in suffix', () => {
      expect(doiValidation.test('10.1234/test-case')).toBe(true);
      expect(doiValidation.test('10.1234/test_case')).toBe(true);
      expect(doiValidation.test('10.1234/test.case')).toBe(true);
      expect(doiValidation.test('10.1234/test(123)')).toBe(true);
    });

    it('should be case-insensitive', () => {
      expect(doiValidation.test('DOI:10.1234/EXAMPLE')).toBe(true);
      expect(doiValidation.test('HTTPS://DOI.ORG/10.1234/EXAMPLE')).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should not match DOI without proper prefix or format', () => {
      expect(doiValidation.test('example')).toBe(false);
    });

    it('should not match DOI with insufficient numeric length', () => {
      expect(doiValidation.test('10.123/example')).toBe(false);
    });

    it('should not match malformed URLs', () => {
      expect(doiValidation.test('htp://doi.org/10.1234/example')).toBe(false);
    });
  });
});

describe('figureValidation', () => {
  describe('valid inputs', () => {
    it('should match alphanumeric strings with underscores and spaces', () => {
      expect(figureValidation.test('Figure 1')).toBe(true);
      expect(figureValidation.test('FIG_A')).toBe(true);
      expect(figureValidation.test('test_123 abc')).toBe(true);
    });

    it('should match empty string (regex has *)', () => {
      expect(figureValidation.test('')).toBe(true);
    });

    it('should match single characters', () => {
      expect(figureValidation.test('A')).toBe(true);
      expect(figureValidation.test('1')).toBe(true);
      expect(figureValidation.test('_')).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should not match strings with dashes', () => {
      expect(figureValidation.test('Figure-1')).toBe(false);
    });

    it('should not match strings with special characters', () => {
      expect(figureValidation.test('test@fig')).toBe(false);
      expect(figureValidation.test('test.fig')).toBe(false);
    });
  });
});

describe('dnaValidation', () => {
  describe('valid inputs', () => {
    it('should match DNA sequences with A, T, C, G (uppercase)', () => {
      expect(dnaValidation.test('ATCG')).toBe(true);
      expect(dnaValidation.test('AAAA')).toBe(true);
      expect(dnaValidation.test('TTTT')).toBe(true);
      expect(dnaValidation.test('CCCC')).toBe(true);
      expect(dnaValidation.test('GGGG')).toBe(true);
    });

    it('should match DNA sequences with a, t, c, g (lowercase)', () => {
      expect(dnaValidation.test('atcg')).toBe(true);
      expect(dnaValidation.test('aaaa')).toBe(true);
    });

    it('should match mixed case DNA sequences', () => {
      expect(dnaValidation.test('AtCg')).toBe(true);
      expect(dnaValidation.test('AaTtCcGg')).toBe(true);
    });

    it('should match empty string (regex has *)', () => {
      expect(dnaValidation.test('')).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should not match DNA sequences with other letters', () => {
      expect(dnaValidation.test('ATCGN')).toBe(false);
      expect(dnaValidation.test('ATCGX')).toBe(false);
      expect(dnaValidation.test('U')).toBe(false);
    });

    it('should not match DNA sequences with numbers', () => {
      expect(dnaValidation.test('ATCG123')).toBe(false);
    });

    it('should not match DNA sequences with spaces or special characters', () => {
      expect(dnaValidation.test('AT CG')).toBe(false);
      expect(dnaValidation.test('AT-CG')).toBe(false);
    });
  });
});

describe('smilesValidation', () => {
  describe('valid inputs', () => {
    it('should match SMILES strings starting with non-J character', () => {
      expect(smilesValidation.test('CC')).toBe(true);
      expect(smilesValidation.test('CCO')).toBe(true);
      expect(smilesValidation.test('c1ccccc1')).toBe(true);
    });

    it('should match SMILES with brackets', () => {
      expect(smilesValidation.test('C[C@H](O)C')).toBe(true);
      expect(smilesValidation.test('[C@@H](O)')).toBe(true);
    });

    it('should match SMILES with special characters', () => {
      expect(smilesValidation.test('C#N')).toBe(true);
      expect(smilesValidation.test('C=C')).toBe(true);
      expect(smilesValidation.test('C\\C')).toBe(true);
      expect(smilesValidation.test('C/C')).toBe(true);
      expect(smilesValidation.test('C(C)C')).toBe(true);
    });

    it('should match SMILES with numbers', () => {
      expect(smilesValidation.test('c1ccc1')).toBe(true);
      expect(smilesValidation.test('C1CCCCC1')).toBe(true);
    });

    it('should match SMILES with @ and + and -', () => {
      expect(smilesValidation.test('[C@H]')).toBe(true);
      expect(smilesValidation.test('C+C')).toBe(true);
      expect(smilesValidation.test('C-C')).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should not match SMILES starting with J', () => {
      expect(smilesValidation.test('JC')).toBe(false);
      expect(smilesValidation.test('J[C@H]')).toBe(false);
    });

    it('should not match single character that is J', () => {
      expect(smilesValidation.test('J')).toBe(false);
    });

    it('should not match empty string', () => {
      expect(smilesValidation.test('')).toBe(false);
    });

    it('should not match strings without valid SMILES characters', () => {
      expect(smilesValidation.test('Z')).toBe(false);
    });
  });
});
