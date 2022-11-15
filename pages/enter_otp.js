import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { dec, enc, secretkeys } from "../helper/common";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setCookie } from "cookies-next";

const EnterOtp = () => {
  const [otp, setOtp] = useState("");
  const [counter, setCounter] = useState(15);
  const [errors, setErrors] = useState({ otpErr: "" });
  const router = useRouter();

  const sumbitOTP = async () => {
    if (otp !== "") {
      let id = localStorage.getItem("id");
      const res = await fetch(
        "http://localhost:3000/api/users/otp_verification",
        {
          method: "POST",
          body: JSON.stringify({ otp, id: dec(id, secretkeys.id) }),
        }
      );
      const otpVerifyAPI = await res.json();
      console.log(otpVerifyAPI);
      if (otpVerifyAPI.success && otpVerifyAPI.user.isEmailVerfied) {
        setTimeout(() => {
          router.push("/");
        }, 2000);
        toast.success(otpVerifyAPI.message);
        toast.success(`Login successfully`);
        // setCookie("uid", otpVerifyAPI.user._id);
        setCookie("uid", otpVerifyAPI.user._id);
      } else {
        toast.error(otpVerifyAPI.message);
      }
    } else {
      setErrors({ otpErr: "please enter otp" });
    }
  };

  const resendOTP = async () => {
    if (counter == 0) {
      let id = localStorage.getItem("id");
      const res = await fetch("http://localhost:3000/api/users/regenerateotp", {
        method: "PUT",
        body: JSON.stringify(dec(id, secretkeys.id)),
      });
      const reOtpApi = await res.json();
      console.log("reOtpApi ==>", reOtpApi);
      if (reOtpApi.success) {
        toast.success(reOtpApi.message);
      } else {
        toast.error(reOtpApi.message);
      }
      setCounter(20);
    }
  };

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <>
      <ToastContainer />
      <div className="container">
        <div className="row justify-content-center ">
          <div className="d-flex">
            <div className="input-group my-3 p-0">
              <span className="input-group-text">OTP</span>
              <input
                type="number"
                className="form-control input-radius"
                placeholder="Enter OTP..."
                maxLength={5}
                onChange={(e) => setOtp(e.target.value)}
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
        <div className="text-center">
          <button
            onClick={resendOTP}
            disabled={counter == 0 ? false : true}
            className="text-center my-4 btn btn-light border"
          >
            Resend Otp {counter > 0 ? `(${counter})` : null}
          </button>
        </div>
      </div>
    </>
  );
};
export default EnterOtp;
