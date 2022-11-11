import { useState } from "react";
import Router, { useRouter } from "next/router";
import { enc, regex, secretkeys } from "../helper/common";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const signup = () => {
  const [form, setForm] = useState("login");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [canLogin, setCanLogin] = useState(false);
  const [errors, seterror] = useState({});

  const router = useRouter();

  const handleSignIn = async () => {
    if (!userData.name) {
      seterror({ nameErr: "please enter your name" });
    } else if (!userData.email) {
      seterror({ emailErr: "enter email" });
    } else if (!userData.email.match(regex.mail)) {
      seterror({ emailErr: "enter valid email" });
    } else if (!userData.password) {
      seterror({ passwordErr: "please enter password" });
    }
    if (
      userData.name &&
      userData.email &&
      userData.email.match(regex.mail) &&
      userData.password
    ) {
      seterror("");
      const res = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      var signinApi = await res.json();
      console.log("SIGNIN API RESPONSE", signinApi);

      if (signinApi.success) {
        setTimeout(() => {
          router.push("/enter_otp");
        }, 2000);
        localStorage.setItem("id", enc(signinApi.newUser._id, secretkeys.id));
        toast.success(signinApi.message);
      } else {
        toast.error(signinApi.message);
      }
    }
  };

  const handleLogin = async () => {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const loginApi = await res.json();

    console.log("LOGIN API RESPONSE", loginApi);

    if (loginApi.success) {
      setTimeout(() => {
        router.push({ pathname: "/" });
      }, 2000);
      toast.success(loginApi.message);
    } else {
      toast.error(loginApi.message);
    }

    if (
      form === "login" &&
      !loginApi.isEmailVerfied &&
      loginApi.message === "Please verify your email"
    ) {
      const res = await fetch("http://localhost:3000/api/users/regenerateotp", {
        method: "PUT",
        body: JSON.stringify(loginApi.user._id),
      });
      const reOtpApi = await res.json();
      setTimeout(() => {
        Router.push({
          pathname: "/enter_otp",
          query: "reverify",
        });
      }, 2000);
      localStorage.setItem("id", enc(loginApi.user._id, secretkeys.id));
      console.log("reOtpApi==>", reOtpApi);
      toast.success(reOtpApi.message);
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center">
      <ToastContainer />
      <div className="p-5 shadow-sm border rounded-5 border-primary bg-white">
        <h2 className="text-center mb-4 text-primary">
          {form === "login" ? "Login Form" : "Signup Form"}
        </h2>
        {form === "login" ? (
          <>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control border border-primary"
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                value={loginData.email}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control border border-primary"
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                value={loginData.password}
              />
            </div>
          </>
        ) : (
          <>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control border border-primary"
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
                value={userData.name}
              />
              <span className="form-error">{errors.nameErr}</span>
            </div>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control border border-primary"
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                value={userData.email}
              />
              <span className="form-error">{errors.emailErr}</span>
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control border border-primary"
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                value={userData.password}
              />
              <span className="form-error">{errors.passwordErr}</span>
            </div>
          </>
        )}
        <p className="small">
          {form === "login" ? (
            <a className="text-primary">Forgot password?</a>
          ) : (
            <>
              <input
                type="checkbox"
                onChange={(e) => setCanLogin(e.target.checked)}
              />
              <label>Terms & Conditions</label>
            </>
          )}
        </p>
        <div className="d-grid">
          {form === "login" ? (
            <button
              className="btn btn-primary"
              type="submit"
              onClick={handleLogin}
            >
              Login
            </button>
          ) : (
            <button
              className="btn btn-primary"
              type="submit"
              onClick={handleSignIn}
              disabled={!canLogin}
            >
              Register
            </button>
          )}
        </div>
        <div className="mt-3">
          {form === "login" ? (
            <>
              <p className="mb-0  text-center">
                Don't have an account?
                <a
                  className="text-primary fw-bold"
                  onClick={() => setForm("signup")}
                >
                  Sign Up
                </a>
              </p>
            </>
          ) : (
            <p className="mb-0  text-center">
              Already user?
              <a
                className="text-primary fw-bold"
                onClick={() => setForm("login")}
              >
                Login
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default signup;
