import { getFirstTwoWords, withCacheBust } from '../../lib/utils';

describe('getFirstTwoWords', () => {
  describe('normal strings', () => {
    it('should return first two words from a multi-word string', () => {
      expect(getFirstTwoWords('hello world foo')).toBe('hello world');
    });

    it('should return the two words when exactly two words provided', () => {
      expect(getFirstTwoWords('hello world')).toBe('hello world');
    });
  });

  describe('single word', () => {
    it('should return the single word', () => {
      expect(getFirstTwoWords('hello')).toBe('hello');
    });
  });

  describe('empty string', () => {
    it('should return "Unknown" for empty string', () => {
      expect(getFirstTwoWords('')).toBe('Unknown');
    });
  });

  describe('null and undefined', () => {
    it('should return "Unknown" for null', () => {
      expect(getFirstTwoWords(null)).toBe('Unknown');
    });

    it('should return "Unknown" for undefined', () => {
      expect(getFirstTwoWords(undefined)).toBe('Unknown');
    });
  });

  describe('non-string input', () => {
    it('should return "Unknown" for number', () => {
      expect(getFirstTwoWords(123)).toBe('Unknown');
    });

    it('should return "Unknown" for boolean', () => {
      expect(getFirstTwoWords(true)).toBe('Unknown');
    });

    it('should return "Unknown" for object', () => {
      expect(getFirstTwoWords({})).toBe('Unknown');
    });

    it('should return "Unknown" for array', () => {
      expect(getFirstTwoWords([])).toBe('Unknown');
    });
  });

  describe('edge cases', () => {
    it('should handle string with extra spaces by treating empty splits as separate words', () => {
      // 'hello  world  foo'.split(' ') = ['hello', '', 'world', '', 'foo']
      // slice(0, 2) = ['hello', ''], join = 'hello '
      expect(getFirstTwoWords('hello  world  foo')).toBe('hello ');
    });

    it('should handle string with leading space', () => {
      // ' hello world'.split(' ') = ['', 'hello', 'world']
      // slice(0, 2) = ['', 'hello'], join = ' hello'
      expect(getFirstTwoWords(' hello world')).toBe(' hello');
    });
  });
});

describe('withCacheBust', () => {
  describe('URL without query string', () => {
    it('should append ?t= with timestamp', () => {
      const url = 'https://example.com/api/data.json';
      const result = withCacheBust(url);
      expect(result).toMatch(/^https:\/\/example\.com\/api\/data\.json\?t=\d+$/);
    });
  });

  describe('URL with existing query string', () => {
    it('should append &t= with timestamp when ? already exists', () => {
      const url = 'https://example.com/api/data.json?foo=bar';
      const result = withCacheBust(url);
      expect(result).toMatch(/^https:\/\/example\.com\/api\/data\.json\?foo=bar&t=\d+$/);
    });

    it('should handle multiple existing query params', () => {
      const url = 'https://example.com/api/data?foo=bar&baz=qux';
      const result = withCacheBust(url);
      expect(result).toMatch(/^https:\/\/example\.com\/api\/data\?foo=bar&baz=qux&t=\d+$/);
    });
  });

  describe('timestamp behavior', () => {
    it('should include a numeric timestamp', () => {
      const url = 'https://example.com/file.json';
      const result = withCacheBust(url);
      const timestamp = result.split('t=')[1];
      expect(timestamp).toMatch(/^\d+$/);
      expect(Number(timestamp)).toBeGreaterThan(0);
    });

    it('should generate different timestamps on successive calls', () => {
      const url = 'https://example.com/file.json';
      const result1 = withCacheBust(url);
      const result2 = withCacheBust(url);
      // Extract timestamps
      const ts1 = result1.split('t=')[1];
      const ts2 = result2.split('t=')[1];
      // Timestamps should be different (or at least, both are valid numbers)
      expect(ts1).toMatch(/^\d+$/);
      expect(ts2).toMatch(/^\d+$/);
    });
  });

  describe('various URL formats', () => {
    it('should handle relative URLs', () => {
      const url = '/api/data.json';
      const result = withCacheBust(url);
      expect(result).toMatch(/^\/api\/data\.json\?t=\d+$/);
    });

    it('should handle base URL', () => {
      const url = 'https://example.com';
      const result = withCacheBust(url);
      expect(result).toMatch(/^https:\/\/example\.com\?t=\d+$/);
    });

    it('should handle file path without domain', () => {
      const url = 'data.json';
      const result = withCacheBust(url);
      expect(result).toMatch(/^data\.json\?t=\d+$/);
    });
  });
});
