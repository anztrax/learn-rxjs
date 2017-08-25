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
  return Observable.create(observer => {
    let xhr = new XMLHttpRequest();

    xhr.addEventListener("load", () => {
      let data = JSON.parse(xhr.responseText);
      observer.next(data);
      observer.complete();
    });

    xhr.open("GET", url);
    xhr.send();
  });
};

const renderMovies = (data) => {
  data.movies.forEach(movie => {
    let div = document.createElement("div");
    div.innerHTML = movie.title;
    output.appendChild(div);
  });
};

//flatmap => klo ada observerable yg balikin observer langsung di subscribe di next action nya, kek semacam !(di swift) buat nge extract value dari not null
moviesClickSource.flatMap(e => load('movies.json'))
  .subscribe(o => console.log(o));

load("movies.json");  //this will not load json until you subscribe it !

moviesClickSource
  .flatMap(e => load("movies.json"))
  .subscribe(
    renderMovies,
  error => console.log(`error : ${error}`),
  () => console.log('complete !')
);