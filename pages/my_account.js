import { useEffect } from "react";
import { useRef } from "react";

const my_account = ({ user2FAStatus }) => {
  const switchRef = useRef();
  console.log("user2FAStatus", user2FAStatus);
  useEffect(() => {
    switchRef.current.checked = user2FAStatus;
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="border p-5 m-5 w-75 text-center">
          <h2>2FA authentication</h2>
          <div className="form-check form-switch mt-4">
            <input
              className="form-check-input"
              type="checkbox"
              ref={switchRef}
            />
            <label className="form-check-label">
              Enable 2FA authentication
            </label>
          </div>
          <hr />
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ req }) {
  if (
    req.cookies.uid != "" &&
    req.cookies.uid != undefined &&
    req.cookies.uid != "undefined"
  ) {
    const call = await fetch(
      "http://localhost:3000/api/users/" + req.cookies.uid
    );
    const res = await call.json();
    return {
      props: {
        user2FAStatus: res.data.is2FAEnabel,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/signup",
        permanent: false,
      },
    };
  }
}

export default my_account;
