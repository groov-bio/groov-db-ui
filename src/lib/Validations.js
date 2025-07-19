// Used for Alias, About, and Ligand Name.
export const alphaNumericValidation = new RegExp(/^[A-Za-z0-9_]+$/);

export const alphaValidation = new RegExp(/^[a-zA-Z0-9-']+$/);

export const numericValidation = new RegExp(/^[0-9]+$/);

export const emailValidation = new RegExp(
  /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
);

//Minimum 8 chars, one much be a number, uppercase and lowercase letter
export const passwordValidation = new RegExp(
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
);

export const aboutValidation = new RegExp(/^[a-zA-Z0-9-_().,/"':; ]+$/);

// Allows alphanumeric as well as periods, underscores, and dashes
// reference: https://stackoverflow.com/questions/10764291/regex-to-match-alphanumeric-characters-underscore-periods-and-dash-allowing-d
export const refseqValidation = new RegExp(
  /^[a-zA-Z0-9_]+([-.][a-zA-Z0-9_]+)*$/
);

// Tried to use this regex for validating DOIs, but it gave an error "Expression expected"
//const doiValidation = new RegExp(/^10.\d{4,9}/[-._;()/:A-Z0-9]+$/i)
// reference: https://www.crossref.org/blog/dois-and-matching-regular-expressions/
export const doiValidation = new RegExp(
  /^(https?:\/\/doi\.org\/|doi:|doi\.org\/)?(10.\d{4,9}[-._;()/:A-Z0-9]+)$/i
);

// Should eventually update to a series of dropdowns, but this is good for now.
export const figureValidation = new RegExp(/^[A-Za-z0-9_ ]*$/);

// Only allows A, T, C, G, a, t, c, or g.
export const dnaValidation = new RegExp(/^[ATCGatcg]*$/);

// this smiles regex validation key was from https://www.biostars.org/p/13468/
export const smilesValidation = new RegExp(
  /^([^J][A-Za-z0-9@+\-\[\]\(\)\\=#$\/.]+)$/
);
