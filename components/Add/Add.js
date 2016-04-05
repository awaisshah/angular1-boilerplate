/**
 * Created by Taimoor-pc on 4/5/2016.
 */


(function() {

    angular.module("myApp")
        .controller("AddController", ['$state', 'addService', AddController]);
        function AddController($state, addService) {

            console.log("add Controller");

            this.user = "";

            this.pushAData = function (newData) {
                addService.insertAData(newData);
                console.log("infunction");
            }

        }

})();