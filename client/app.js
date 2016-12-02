/**
 * Created by Taimoor tariq on 1/19/2016.
 */

(function () {

    angular.module("myApp", ['ui.router', 'ngMaterial'])
        .controller("AppController", ['$state', AppController])

    function AppController($state) {

        this.goToView = function () {
            $state.go('view')
        };


        this.goToAdd = function () {
            $state.go('add')
        };

    }


})();