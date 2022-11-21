import Link from "next/link";
import { deleteCookie } from "cookies-next";
import { hasCookie } from "cookies-next";
import { useState } from "react";
import { useEffect } from "react";

export default function Header() {
  const handleLogout = () => {
    deleteCookie("uid");
  };
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);
  useEffect(() => {
    hasCookie("uid") ? setIsUserLoggedIn(true) : setIsUserLoggedIn(false);
  });
  return (
    <>
      <div className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/">
          Rudra <span className="text-warning">&spades;</span>
        </a>
        <button className="navbar-toggler">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link href="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item active">
              <Link href="/dashboard" className="nav-link">
                Dashboard
              </Link>
            </li>
            {isUserLoggedIn ? (
              <li className="nav-item">
                <Link href="/my_account" className="nav-link">
                  My account
                </Link>
              </li>
            ) : null}
          </ul>
          {isUserLoggedIn ? (
            <>
              <button className="btn btn-outline-secondary ms-auto me-5">
                <Link
                  href="/signup"
                  className="nav-link"
                  onClick={handleLogout}
                >
                  Logout
                </Link>
              </button>
            </>
          ) : (
            <button className="btn btn-outline-primary ms-auto me-5">
              <Link href="/signup" className="nav-link">
                Login
              </Link>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
