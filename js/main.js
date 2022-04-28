import {System} from "./system.js";

const canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

if (canvas.getContext) {
  const system = new System(canvas, 800, 10, 30);
  
  function main () {
    system.render();
    requestAnimationFrame(main);
  };

  main();
} else {
  console.error("Your browser does not support HTML canvas");
};
