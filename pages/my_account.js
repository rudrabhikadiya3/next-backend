import { getCookies } from "cookies-next";
import React, { useState } from "react";
import withAuth from "../components/Auth";

const my_account = () => {
  const [res, setRes] = useState("");
  const [userOTP, setUserOTP] = useState("");

  const handleChange = async (is2FAEnabel) => {
    //on swith on
    if (is2FAEnabel) {
      const call = await fetch(
        "http://localhost:3000/api/users/authentication",
        {
          method: "POST",
          body: JSON.stringify(getCookies("uid")),
        }
      );
      const res = await call.json();
      console.log("uid", getCookies("uid"));
      setRes(res);
    }
  };
  // const submityOtp = async () => {
  //   const call = await fetch("http://localhost:3000/api/users/2faOtpVerify", {
  //     method: "POST",
  //     body: JSON.stringify({ uid: getCookies("uid").uid, userOTP }),
  //   });
  //   const res = await call.json();
  // };
  console.log("res", res);
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="border p-5 m-5 w-75 text-center">
          <h2>2FA authentication</h2>
          <div className="form-check form-switch mt-4">
            <input
              className="form-check-input"
              type="checkbox"
              onChange={(e) => {
                handleChange(e.target.checked);
              }}
            />
            <label className="form-check-label">
              Enable 2FA authentication
            </label>
          </div>
          <hr />
          {res ? (
            <>
              <div className="text-center">
                <img src={res.user.QRcode} />
                <h6 className="my-3">{res.user.base32}</h6>
                <input
                  type="number"
                  placeholder="enter otp..."
                  onChange={(e) => setUserOTP(e.target.value)}
                />
                <button onClick={submityOtp}>submit</button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default withAuth(my_account);
