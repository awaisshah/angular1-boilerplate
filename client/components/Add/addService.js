/**
 * Created by Taimoor-pc on 4/5/2016.
 */


(function () {

    angular.module("myApp")
        .service("addService", function () {
            var arr = [];

            this.insertAData = function (newData) {
                arr.push(newData);
                console.log(arr);
            };

            this.getData = function () {
                return arr;
            };

        })

})();