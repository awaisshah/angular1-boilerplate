/**
 * Created by Taimoor-pc on 4/5/2016.
 */


(function () {
    angular.module("myApp")
        .config(function ($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state("Add" ,{
                    url: '/Add',
                    templateUrl: './components/Add/Add.html',
                    controller: 'AddController',
                    controllerAs: 'add'

                })

                .state("View", {
                    url: '/View',
                    templateUrl: './components/View/View.html',
                    controller: 'ViewController'
                });

           // $urlRouterProvider.otherwise('/View');
        })
    
    
})();