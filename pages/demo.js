import { useEffect, useRef, useState } from "react";

const demo = () => {
  const [checkBox, setCheckBox] = useState(null);

  const checkRef = useRef();

  useEffect(() => {
    // checkRef.current.checked = true;
  }, []);
  console.log(checkBox);
  const renderDetails = () => {
    // if (checkBox === true && ) {
    // }
  };
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="border p-5 m-5 w-75 text-center">
          <h2>2FA authentication</h2>
          <div className="form-check form-switch mt-4">
            <input
              className="form-check-input"
              type="checkbox"
              // ref={checkRef}
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

export default demo;
