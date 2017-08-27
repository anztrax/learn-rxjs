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
      if(xhr.status === 200) {
        let data = JSON.parse(xhr.responseText);
        observer.next(data);
        observer.complete();
      }else{
        observer.error(xhr.status);
      }
    });

    xhr.open("GET", url);
    xhr.send();
  }).retryWhen(retryStrategy({attempts: 3, delay : 1500}));
};

const loadWithFetch = (url: string) => {
  //Observable.fromPromise() is not lazy so we need to DEFER it !
  return Observable.defer(() => {
    return Observable.fromPromise(fetch(url).then(r => r.json()));
  });
};

const retryStrategy = ({attempts = 4, delay = 1000}) => {
  return (errors) => {
    return errors
      .scan((accumulator, value) => {
        console.log(accumulator, value);
        return accumulator + 1;
      }, 0)
      .takeWhile(accumulator => accumulator < attempts)
      .delay(delay);
  }
};

const renderMovies = (data) => {
  data.movies.forEach(movie => {
    let div = document.createElement("div");
    div.innerHTML = movie.title;
    output.appendChild(div);
  });
};

loadWithFetch("movies.json");

moviesClickSource
  .flatMap(e => loadWithFetch("movies.json"))
  .subscribe(
    renderMovies,
  error => console.log(`error : ${error}`),
  () => console.log('complete !')
);