var QRCode = require("qrcode");
const demo = () => {
  QRCode.toDataURL(
    "otpauth://totp/SecretKey?secret=KM2XKS3PKAQWG63GIIYDKMTNINASG233NBETKUKJMJDUUZBRKV4A"
  )
    .then((url) => {
      console.log(url);
    })
    .catch((err) => {
      console.error(err);
    });

  return (
    <div className="container">
      <div className="row">
        <div className="border p-5"></div>
      </div>
    </div>
  );
};

export default demo;
