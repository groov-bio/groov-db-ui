function getFirstTwoWords(inputString) {
  // Handle undefined, null, or empty string cases
  if (!inputString || typeof inputString !== 'string') {
    return 'Unknown';
  }
  
  // Split the string by spaces
  let words = inputString.split(' ');
  // Get the first two words
  let firstTwoWords = words.slice(0, 2);
  // Join them back into a string
  return firstTwoWords.join(' ');
}

// TEMPORARY cache-buster for the public v2/*.json data files.
//
// Those files are served with no `Cache-Control` header, so browsers apply
// heuristic caching (~10% of the file's age) and keep serving a stale copy
// without revalidating. That's why a freshly published sensor can take hours
// to show up in the /database table for returning users. Appending a unique
// query param forces a fresh fetch every load, which un-sticks users who are
// already holding a stale copy.
//
// This defeats CDN caching too (every URL is unique), so REMOVE this once the
// real fix is live in Cloudflare: short Browser TTL + long Edge TTL + a cache
// purge on data publish. See the Cloudflare setup notes in the PR.
function withCacheBust(url) {
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}t=${Date.now()}`;
}

export { getFirstTwoWords, withCacheBust };
