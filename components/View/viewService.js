/**
 * Created by Taimoor-pc on 4/5/2016.
 */


(function () {

    angular.module("myApp")
        .service("viewService", function (addService) {
            var viewArr = [];
            this.call = function() {
                viewArr = addService.getData();
                console.log(viewArr);
                return viewArr;
            }
        })

})();