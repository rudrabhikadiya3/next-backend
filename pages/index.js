import { useRef, useState } from "react";
import Layout from "../components/Layout";

export default function Home({ names }) {
  const inputRef = useRef();
  const [data, setData] = useState("");
  const handleSubmit = () => {
    fetch("http://localhost:3000/api/hello", {
      method: "POST",
      body: data,
    });
    inputRef.current.value = "";
  };
  const handleDelete = (id) => {
    console.log(id);
  };
  return (
    <Layout>
      <>
        <div className="col-5 mx-auto text-center my-5">
          <input
            type="text"
            onChange={(e) => setData(e.target.value)}
            placeholder="name"
            ref={inputRef}
          />
          <button onClick={handleSubmit}>Add</button>
        </div>
        {names.map((d, i) => {
          return (
            <ul className="list-group" key={i}>
              <li className="list-group-item">
                {d.name}
                <div className="d-inline-block ms-5 border">
                  <button onClick={() => handleDelete(d._id)}>D</button>
                  <button>E</button>
                </div>
              </li>
            </ul>
          );
        })}
      </>
    </Layout>
  );
}
export const getServerSideProps = async () => {
  const res = await fetch("http://localhost:3000/api/name");
  const names = await res.json();
  return {
    props: { names },
  };
};
