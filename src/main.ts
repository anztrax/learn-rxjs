import { Observable, Observer } from 'rxjs';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/from';
// import 'rxjs/operator/map';
// import 'rxjs/operator/filter';
// import 'rxjs/observable/cre';
// import { Observer } from 'rxjs/Observer';

//observerable is data source
let numbers = [1,5,10];
let source = Observable.from(numbers);

//using low level observable
let source2 = Observable.create(observer => {
    for(let n of numbers){
        /**
         * raising .error is like raising error !
         */
        // if(n === 5){
        //     observer.error("something went wrong !");
        // }
        observer.next(n);
    }

    observer.complete();
});

source2.subscribe(
    value => console.log(`value : ${value}`),
    e => console.log(`error : ${e}`),
    () => console.log('informal complete !')
);

//more formal way to implement observer is through Observer<Expected data from observerable>
class MyObserver implements Observer<Number>{
    next(value){
        console.log(`value : ${value}`);
    }

    error(e){
        console.log(`error : ${e}`);
    }

    /**
        if data is already complete then this method is called ,
     harusnya complete jarang digunakan karena bisa aja data stream itu tidak ada habisnya seperti mouse move value, etc
     */
    complete(){
        console.log("complete");
    }
}

//1 observable bisa di lister bnyk observer
source.subscribe(new MyObserver());


/**
 * try async observable
 * map is OPERATOR !
 */
let numbers2 = [1, 5, 10];
let source3 = Observable.create(observer => {
    let index = 0;
    let produceValue = () =>{
        observer.next(numbers2[index++]);
        if(index < numbers2.length){
            setTimeout(produceValue, 250);
        }else{
            observer.complete();
        }
    };
    produceValue();
}).map(n => n * 2)      //process each item into individual observable stream
    .map(n => n * 1)
    .filter(n => n > 4);

source3.subscribe(
    value => console.log(`value : ${value}`),
    e => console.log(`error : ${e}`),
    () => console.log('informal complete !')
);


