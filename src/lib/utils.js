function getFirstTwoWords(inputString) {
  // Split the string by spaces
  let words = inputString.split(' ');
  // Get the first two words
  let firstTwoWords = words.slice(0, 2);
  // Join them back into a string
  return firstTwoWords.join(' ');
}

export { getFirstTwoWords };
