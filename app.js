/**
 * Created by Taimoor-pc on 4/5/2016.
 */

(function () {
    angular.module("myApp", ['ui.router', 'ngMaterial'])
        .controller("AppController", ['$state', AppController]);
        function AppController($state) {
           // this.counter = 0;
            this.goToAdd = function() {
               // this.counter = 8;
                $state.go("Add");
                //console.log("Counter Value, ",++(this.counter));

            };

            this.goToView = function() {
                $state.go("View")

            };

        }

})();