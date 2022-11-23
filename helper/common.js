import { getCookies } from "cookies-next";

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
  json: "asdasdadsasdasdcxzswerfgtyhjnmkl",
  base32: "ASXDhjnh^0SW#$%^&*BGKLbvcdfc3032",
  qr: "ASXDhgfrgv7pl586&*BGKLbvcd5s6vzm",
};

export const regex = {
  mail: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
};

export const crrUserID = () => {
  return getCookies("uid").uid;
};

export const UTStoDate = (uts) => {
  var date = new Date(uts);
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();

  var hours = date.getHours();
  var minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

  let time = `${day}/${month + 1}/${year} ${hours}:${minutes}`;
  return time;
};
