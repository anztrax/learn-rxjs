import {Observable } from "rxjs";
import { load, loadWithFetch } from './loader';

let source = Observable.create((observer) => {
  observer.next(1);
  observer.next(2);
  observer.error("stop");
  observer.next(3);
  observer.complete();
});

//NOTE : when error occurred when
let mergedSource = Observable.merge(
  Observable.of(1),
  Observable.from([2,3,4]),
  Observable.throw(new Error("Stop !")),
  Observable.of(5)
).catch(e => {
  console.log(`caught : ${e}`);
  return Observable.of(10);
});



mergedSource.subscribe(
  value => console.log(`value : ${value}`),
  error => console.log(`error : ${error}`),
  () => console.log("complete !")
);


// const circle = document.getElementById("circle");
// let source = Observable.fromEvent(document,"mousemove").map((e: MouseEvent) => {
//   return {
//     x : e.clientX,
//     y : e.clientY
//   }
// }).filter(value => value.x < 500 && value.y < 200)
//   .delay(100);
//
//
// const onNext = (value) => {
//   circle.style.left = `${value.x}px`;
//   circle.style.top = `${value.y}px`;
// };
//
// source.subscribe(
//   onNext,
//   error => console.log(`error : ${error}`),
//   () => console.log('complete with simple function !')
// );
//
//
// const button = document.getElementById("getMoviesBtn");
// const output = document.getElementById("moviesOutput");
// let moviesClickSource = Observable.fromEvent(button,"click");
//
// const renderMovies = (data) => {
//   data.movies.forEach(movie => {
//     let div = document.createElement("div");
//     div.innerHTML = movie.title;
//     output.appendChild(div);
//   });
// };
//
// loadWithFetch("movies.json");
//
// moviesClickSource
//   .flatMap(e => loadWithFetch("movies.json"))
//   .subscribe(
//     renderMovies,
//     error => console.log(`error : ${error}`),
//     () => console.log('complete !')
//   );