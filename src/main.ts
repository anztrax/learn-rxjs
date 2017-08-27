import {Observable } from "rxjs";
import { load, loadWithFetch } from './loader';

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

const renderMovies = (data) => {
  data.movies.forEach(movie => {
    let div = document.createElement("div");
    div.innerHTML = movie.title;
    output.appendChild(div);
  });
};

loadWithFetch("moviess.json");

moviesClickSource
  .flatMap(e => loadWithFetch("moviess.json"))
  .subscribe(
    renderMovies,
    error => console.log(`error : ${error}`),
    () => console.log('complete !')
  );