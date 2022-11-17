import { getCookies, setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { dec, secretkeys } from "../helper/common";

// otp input for 2FA otp
const twoFAotp = () => {
  const [errors, setErrors] = useState({ otpErr: "" });
  const [userOTP, setuserOTP] = useState("");
  const router = useRouter();
  const sumbitOTP = async () => {
    if (userOTP !== "") {
      const uid = localStorage.getItem("id");
      const call = await fetch(
        process.env.BASE_URL + "api/users/2FAotpVerify",
        {
          method: "POST",
          body: JSON.stringify({ uid: dec(uid, secretkeys.id), userOTP }),
        }
      );
      const res = await call.json();
      console.log(res);
      if (res.success === true) {
        setCookie("uid", res.user._id);
        setTimeout(() => {
          router.push("/");
        }, 2000);
        toast.success(res.message);
        // use logged in
      } else {
        toast.error(res.message);
      }
    } else {
      setErrors({ otpErr: "please enter otp" });
    }
  };

  return (
    <div className="container">
      <ToastContainer />
      <h3 className="text-center my-3">Please enter authenticator otp </h3>
      <div className="row justify-content-center ">
        <div className="d-flex">
          <div className="input-group my-3 p-0">
            <span className="input-group-text">OTP</span>
            <input
              type="number"
              className="form-control input-radius"
              placeholder="Enter OTP..."
              maxLength={5}
              onChange={(e) => setuserOTP(e.target.value)}
            />
          </div>
          <div className="p-0 my-3">
            <button
              className="btn btn-primary button-radius"
              onClick={sumbitOTP}
            >
              submit
            </button>
          </div>
        </div>
      </div>
      <span className="form-error text-center d-block">{errors.otpErr}</span>
    </div>
  );
};

export default twoFAotp;
