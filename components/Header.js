import Link from "next/link";
import { deleteCookie } from "cookies-next";
import { hasCookie } from "cookies-next";

export default function Header() {
  const handleLogout = () => {
    deleteCookie("uid");
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
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
            <li className="nav-item">
              <Link href="/addproduct" className="nav-link">
                product+
              </Link>
            </li>

            {hasCookie("uid") ? (
              <>
                <li className="nav-item">
                  <Link
                    href="/signup"
                    className="nav-link"
                    onClick={handleLogout}
                  >
                    Logout
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/my_account" className="nav-link">
                    My account
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link href="/signup" className="nav-link">
                  Signup
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}
