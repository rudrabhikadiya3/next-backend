import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { getCookies } from "cookies-next";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { dec, secretkeys, UTStoDate } from "../helper/common";
import Balance from "../components/mini_component/Balance";

const my_account = ({ user2FAStatus, crrUserDetails }) => {
  const bal = crrUserDetails.user.balance;
  const [CheckBox, setCheckBox] = useState(user2FAStatus); //retun checkbox status (true / false)

  const [userOTP, setUserOTP] = useState(""); // 2FA viceversa otp

  const [myTransaction, setMyTransaction] = useState([]);

  const switchRef = useRef();

  const QRrender = () => {
    if (CheckBox === true) {
      if (!user2FAStatus) {
        return (
          <>
            <h3>QR code</h3>
            <div className="text-center">
              <img src={crrUserDetails.QR} />
              <h6 className="my-3">
                {dec(crrUserDetails.user.base32, secretkeys.base32)}
              </h6>
              <input
                type="number"
                placeholder="enter otp..."
                onChange={(e) => setUserOTP(e.target.value)}
              />
              <button onClick={submitOtp}>submit</button>
            </div>
          </>
        );
      } else {
        return <h4 className="text-warning"> 2FA enabled</h4>;
      }
    }
    if (CheckBox === false) {
      if (!user2FAStatus) {
        return <h4 className="text-warning"> 2FA disabled</h4>;
      } else {
        return (
          <>
            <h3>Enter OTP for disable</h3>
            <input
              type="number"
              placeholder="enter otp.."
              onChange={(e) => setUserOTP(e.target.value)}
            />
            <button onClick={submitOtp}>submit</button>
          </>
        );
      }
    }
  };

  // otp for enable/disable 2FA
  const submitOtp = async () => {
    if (userOTP) {
      const call = await fetch(
        process.env.BASE_URL + "api/users/2FAstatusChange",
        {
          method: "POST",
          body: JSON.stringify({ uid: getCookies("uid").uid, userOTP }),
        }
      );
      const res = await call.json();
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    }
  };

  const listTransactions = async () => {
    const transactionRes = await fetch(
      process.env.BASE_URL + "api/fin/transactions"
    );

    const allTransaction = await transactionRes.json();

    const onlyMyTransaction = await allTransaction.data.filter(
      (t) => t.user_id == getCookies("uid").uid
    );
    // sort by time (latest up)
    onlyMyTransaction.sort((a, b) =>
      a.transactedAt > b.transactedAt
        ? -1
        : b.transactedAt > a.transactedAt
        ? 1
        : 0
    );
    setMyTransaction(onlyMyTransaction);
  };
  useEffect(() => {
    switchRef.current.checked = user2FAStatus;
    listTransactions();
  }, []);
  return (
    <div className="container">
      <ToastContainer />
      <div className="row justify-content-center">
        <Balance bal={bal} reRender={listTransactions} />
        <div className="transaction-box mt-5">
          <h3>Recent Transaction</h3>
          <div className="card">
            <ul className="list-group list-group-flush">
              {myTransaction.map((t, i) => {
                if (t.type === 0) {
                  return (
                    <li className="list-group-item red-bg" key={i}>
                      <div>
                        <p className="name">{t.from_name}</p>
                        <p className="amount text-danger">-${t.amount}</p>
                      </div>
                      <span className="time">{UTStoDate(t.transactedAt)}</span>
                    </li>
                  );
                } else {
                  return (
                    <li className="list-group-item green-bg" key={i}>
                      <div>
                        <p className="name">{t.from_name}</p>
                        <p className="amount text-success">+${t.amount}</p>
                      </div>
                      <span className="time">{UTStoDate(t.transactedAt)}</span>
                    </li>
                  );
                }
              })}
            </ul>
          </div>
        </div>

        <div className="border p-5 m-5 w-75 text-center mx-auto">
          <h2>2FA authentication</h2>
          <div className="form-check form-switch mt-4">
            <input
              className="form-check-input"
              type="checkbox"
              ref={switchRef}
              onChange={(e) => setCheckBox(e.target.checked)}
            />
            <label className="form-check-label">2FA authentication</label>
          </div>
          <hr />
          {QRrender()}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ req }) {
  // 2FA status of current user
  if (
    req.cookies.uid != "" &&
    req.cookies.uid != undefined &&
    req.cookies.uid != "undefined"
  ) {
    const call = await fetch(
      process.env.BASE_URL + "api/users/" + req.cookies.uid
    );
    const res = await call.json();

    const callAuth = await fetch(
      process.env.BASE_URL + "api/users/authentication",
      {
        method: "POST",
        body: req.cookies.uid,
      }
    );
    const resAuth = await callAuth.json();

    return {
      props: {
        user2FAStatus: res.data.is2FAEnabel,
        crrUserDetails: resAuth,
      },
    };
  } else {
    // privateRoute
    return {
      redirect: {
        destination: "/signup",
        permanent: false,
      },
    };
  }
}

export default my_account;
