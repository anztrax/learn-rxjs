import {Observable, Observer } from "rxjs";
// import {Observable} from "rxjs/Observable";
// import "rxjs/add/observable/from";
// import "rxjs/add/operator/map";
// import "rxjs/add/operator/filter";
// import {Observer} from "rxjs/Observer";

//observable
let numbers = [1, 5, 10];
let source = Observable.from(numbers);
let sourceWithErrorTriggered = Observable.create(observer => {
  for(let n of numbers){
    if(n === 5){
      observer.error("Something went wrong !");
    }
    observer.next(n);
  }
  observer.complete();
});

let sourceWithTimeout = Observable.create(observer => {
  let index = 0;
  let produceValue = () => {
    observer.next(numbers[index++]);

    if(index < numbers.length){
      setTimeout(produceValue,200);
    }else{
      observer.complete();
    }
  };

  produceValue();
}).map(n => n * 2)
  .filter(n => n > 4);

//observer
sourceWithTimeout.subscribe(
  value => console.log(`value : ${value}`),
  error => console.log(`error : ${error}`),
  () => console.log('complete with simple function !')
);

source.subscribe(
  value => console.log(`value : ${value}`),
  error => console.log(`error : ${error}`),
  () => console.log('complete with simple function !')
);

//interface that back Number values
class MyObserver implements Observer<Number>{
  next(value){
    console.log(`value : ${value}`);
  }

  error(e){
    console.error(`error : ${e}`);
  }

  complete(){
    console.log("complete");
  }
}
source.subscribe(new MyObserver());
sourceWithErrorTriggered.subscribe(new MyObserver());