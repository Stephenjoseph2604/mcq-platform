// import CryptoJS from 'crypto-js';

const SECRET_KEY = 'MCQQuiz2026Key!@#'; // Change this secret key

export const encryptId = (id) => {
  return btoa(id.toString()); // Base64 encode (your previous preference)
};

export const decryptId = (encryptedId) => {
  return atob(encryptedId); // Decode back to ID
};
