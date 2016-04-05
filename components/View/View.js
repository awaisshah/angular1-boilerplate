/**
 * Created by Taimoor-pc on 4/5/2016.
 */


/**
 * Created by Taimoor-pc on 4/5/2016.
 */


(function() {

    angular.module("myApp")
        .controller("ViewController", ['$state','viewService', ViewController]);
    function ViewController($state, viewService) {

            this.temp = viewService.call();
            console.log(this.temp);

    }



})();