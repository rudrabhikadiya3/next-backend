const crypto = require("crypto");

export function dec(encryptedMessage, secret) {
  var iv = secret.substr(0, 16);
  var decryptor = crypto.createDecipheriv("aes-256-ctr", secret, iv);
  return (
    decryptor.update(encryptedMessage, "base64", "utf8") +
    decryptor.final("utf8")
  );
}
export function enc(textToEncrypt, secret) {
  var iv = secret.substr(0, 16);
  var encryptor = crypto.createCipheriv("aes-256-ctr", secret, iv);
  return (
    encryptor.update(textToEncrypt, "utf8", "base64") +
    encryptor.final("base64")
  );
}
export const secretkeys = {
  password: "qwertyuiopasdfghjklzxcvbnm123456",
  id: "llllaxsdcfgvbhnjmkuuesirwsradsad",
};

export const regex = {
  mail: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
};
