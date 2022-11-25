import { useEffect, useRef, useState } from "react";

const demo = () => {
  let attemp = 0;
  let auto = setInterval(() => {
    console.log(attemp++);
    if (attemp >= 4) {
      clearInterval(auto);
      console.log("OVER");
    }
  }, 1000);
  return <h1>demo</h1>;
};

export default demo;
