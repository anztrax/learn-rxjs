import {Observable } from "rxjs";

const circle = document.getElementById("circle");
let source = Observable.fromEvent(document,"mousemove").map((e: MouseEvent) => {
  return {
    x : e.clientX,
    y : e.clientY
  }
}).filter(value => value.x < 500 && value.y < 200)
  .delay(100);


const onNext = (value) => {
  circle.style.left = `${value.x}px`;
  circle.style.top = `${value.y}px`;
};

source.subscribe(
  onNext,
  error => console.log(`error : ${error}`),
  () => console.log('complete with simple function !')
);


const button = document.getElementById("getMoviesBtn");
const output = document.getElementById("moviesOutput");
let moviesClickSource = Observable.fromEvent(button,"click");

const load = (url: string) => {
  let xhr = new XMLHttpRequest();
  xhr.addEventListener("load", () => {
    let movies = JSON.parse(xhr.responseText);
    movies.movies.forEach(movie => {
      let div = document.createElement("div");
      div.innerHTML = movie.title;
      output.appendChild(div);
    });
  });
  xhr.open("GET", url);
  xhr.send();
};

moviesClickSource.subscribe(
  e => load("movies.json"),
  error => console.log(`error : ${error}`),
  () => console.log('complete !')
);