import { Observable, Observer } from 'rxjs';

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