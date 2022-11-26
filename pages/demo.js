import { useEffect, useRef, useState } from "react";

const demo = () => {
  let letter = (o, t, th, fo, fi, si) => {
    return `${o}-${t}-${th}-${fo}-${fi}-${si}`;
  };

  return <h1>{letter(1, 2, 3, 4, 5, 6)}</h1>;
};

export default demo;
