
"use strict";
var gridApp = angular.module('gridApp', []);


// Отключение заголовка "X-Requested-With", так как заголовок блокируется
// сервером
gridApp.config(['$httpProvider', function($httpProvider) {
  delete $httpProvider.defaults.headers.common["X-Requested-With"]
}]);

// TOFIX: после изменения формата заголовка удалить и изменить, соотв. код
// Использование кода искать в GridCtrl
function replaceHead () {
  var head = [
    {
      name: "id",
      title: "Идентификатор",
      type: "number"
    },
    {
      name: "name",
      title: "Название",
      type: "string"
    },
    {
      name: "price",
      title: "Стоимость",
      type: "number"
    },
    {
      name: "bid",
      title: "Ставка",
      type: "number"
    }
  ];
  return head;
}