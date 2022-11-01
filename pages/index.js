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
  console.log(names);
  return (
    <Layout>
      <>
        <input
          type="text"
          onChange={(e) => setData(e.target.value)}
          placeholder="name"
          ref={inputRef}
        />
        <button onClick={handleSubmit}>submit</button>
        {names.map((n, i) => {
          return (
            <ul className="list-group" key={i}>
              <li className="list-group-item">{n.name}</li>
            </ul>
          );
        })}
      </>
    </Layout>
  );
}
export const getServerSideProps = async () => {
  const res = await fetch("http://localhost:3000/api/hello");
  const names = await res.json();
  return {
    props: { names },
  };
};
