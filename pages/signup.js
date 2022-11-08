import React, { useState } from "react";

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

  const handleSignIn = () => {
    console.log(userData);
  };
  const handleLogin = () => {
    console.log("handleLogin");
  };

  return (
    <div className="vh-100 d-flex align-items-center mx-auto">
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
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control border border-primary"
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control border border-primary"
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
              />
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
            <p className="mb-0  text-center">
              Don't have an account?
              <a
                className="text-primary fw-bold"
                onClick={() => setForm("signup")}
              >
                Sign Up
              </a>
            </p>
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
