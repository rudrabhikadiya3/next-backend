import React, { useState } from "react";
import { NEW_PRODUCT_API } from "../URLs";

const demo = () => {
  const [userFile, setUserFile] = useState("");

  const handleChange = (file) => {
    setUserFile(file);
  };

  const handleSubmit = () => {
    let fdata = new FormData();
    fdata.append("img", userFile);
    console.log(fdata);

    fetch(NEW_PRODUCT_API, {
      method: "POST",
      body: fdata,
      headers: {
        Accept: "multipart/form-data",
      },
    });
  };
  return (
    <>
      <input type="file" onChange={(e) => handleChange(e.target.files[0])} />
      <button onClick={handleSubmit}>submit</button>
    </>
  );
};

export default demo;
