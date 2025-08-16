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

export { getFirstTwoWords };
