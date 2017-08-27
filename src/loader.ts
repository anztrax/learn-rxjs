import {Observable } from "rxjs";

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
    return Observable.fromPromise(
      fetch(url).then(r => {
        if (r.status === 200) {
          return r.json();
        }else{
          //if something is wrong reject the promise !
          return Promise.reject(r);
        }
      })
    );
  }).retryWhen(retryStrategy({attempts : 4, delay : 1000}));
};

const retryStrategy = ({attempts = 4, delay = 1000}) => {
  return (errors) => {
    return errors
      .scan((accumulator, value) => {
        accumulator +=1;
        if(accumulator < attempts){
          return accumulator;
        }else{
          throw new Error(value);
        }
      }, 0)
      .delay(delay);
  }
};

export {
  load,
  loadWithFetch,
  retryStrategy
}