import { useEffect, useRef, useState } from "react";

import "bootstrap-icons/font/bootstrap-icons.css";
import { NAME_API } from "../URLs";
import Link from "next/link";

export default function Home() {
  const inputRef = useRef();
  const [update, setUpdate] = useState(false);
  const [newData, setNewData] = useState({});
  const [allData, setAllData] = useState([]);

  const displayData = async () => {
    const res = await fetch(NAME_API);
    const names = await res.json();
    setAllData(names);
  };
  useEffect(() => {
    displayData();
  }, []);

  const handleShow = (listData) => {
    setUpdate(true);
    inputRef.current.value = listData.name;
    setNewData(listData);
  };

  const handleSubmit = () => {
    if (!update) {
      fetch(NAME_API + "insert", {
        method: "POST",
        body: inputRef.current.value,
      });
    } else {
      fetch(NAME_API + "update", {
        method: "PUT",
        body: JSON.stringify({ ...newData, name: inputRef.current.value }),
      });
    }
    inputRef.current.value = "";
  };
  const handleDelete = (id) => {
    window.location.reload();
    fetch(NAME_API + "delete", {
      method: "POST",
      body: id,
    });
  };
  return (
    <>
      <div className="col-5 mx-auto text-center my-5">
        <input type="text" placeholder="name" ref={inputRef} />
        {update ? (
          <button onClick={handleSubmit}>Change</button>
        ) : (
          <button onClick={handleSubmit}>Add</button>
        )}
      </div>
      <ul className="list-group">
        {allData.map((d, i) => (
          <li className="list-group-item" key={i}>
            {d.name}
            <div className="d-inline-block ms-5 border">
              <button onClick={() => handleDelete(d._id)}>
                <Link href={"/"}>
                  <i className="bi bi-trash3-fill"></i>
                </Link>
              </button>
              <button onClick={() => handleShow({ id: d._id, name: d.name })}>
                <i className="bi bi-pencil-fill"></i>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
