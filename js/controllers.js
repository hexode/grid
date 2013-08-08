// MAIN CONTROLLER
(function (ng, gridApp) {
  "use strict";
  function MainCtrl($scope) {
    this.scope =$scope;
    this.scope.gridQuantity = 1;
    this.scope.gridIds = [0];
    this.scope.addGrid = ng.bind(this, this.addGrid);
  }
  MainCtrl.prototype  = {
    addGrid: function () {
      this.scope.gridQuantity++;
      this.scope.gridIds.push(this.scope.gridQuantity);
    }
  }
  gridApp.controller('MainCtrl', MainCtrl);

})(angular, gridApp);


// GRID CONTROLLER
(function (ng, gridApp) {
  "use strict";
  function GridCtrl($scope, $http, DataSrvc) {
    var GridCtrl = this;
    this.scope = $scope;
    this.DataSrvc = DataSrvc;
    this.scope.dataType = undefined;
    this.scope.dataStorage = {};

    this.scope.head = undefined;
    this.scope.rows = undefined;

    this.scope.errorMessage = "";

    this.signRows = ng.bind(this, this.signRows);
    this.scope.switchDataType = ng.bind(this, this.switchDataType);

  }
  GridCtrl.prototype = {
    // Подписывает заголовками и обрабатывает строки в зависимости от типов
    // данных
    signRows: function (head, rows) {
      var signRows;
      signRows = rows.map(function (row) {
        var cellIx, cellValue, signedRow = [], signedCell, headCell;
        for (cellIx = 0; cellIx < row.length; cellIx++) {
          signedCell = {};
          headCell = head[cellIx];
          cellValue = row[cellIx];

          signedCell.name = headCell.name;
          if (headCell.type === "number") {
            cellValue = parseInt(cellValue);
          }
          signedCell.value = cellValue;
          signedRow.push(signedCell);
        }
        return signedRow;
      })
      return signRows;
    },

    // Переключение типа данных
    switchDataType: function () {
      var dataType = this.scope.dataType,
          dataStorage = this.scope.dataStorage;
          GridCtrl = this;
      if (!dataStorage[dataType]) {
        var promise = this.DataSrvc.get(dataType);
        dataStorage[dataType] = {};
        if (ng.isFunction(promise.success)) {
          promise.success(function (responseData) {
            dataStorage[dataType].head = replaceHead();
            dataStorage[dataType].rows = GridCtrl.signRows(dataStorage[dataType].head, responseData.slice(1));
            GridCtrl.scope.head = dataStorage[dataType].head;
            GridCtrl.scope.rows = dataStorage[dataType].rows;
          }).error(function (responseError) {

            GridCtrl.scope.errorMessage = "Ошибка получения данных с сервера";
          });
        }
        else {
          dataStorage[dataType].head = replaceHead();
          // TOFIX: Выкинуть этот блок проверки так как он дефальсифицирует данные
          if (dataType === "custom") {
            dataStorage[dataType].head = promise[0];
          }
          dataStorage[dataType].rows = this.signRows(dataStorage[dataType].head, promise.slice(1));
        }

      }
      if (dataStorage[dataType]) {
        this.scope.head = dataStorage[dataType].head;
        this.scope.rows = dataStorage[dataType].rows;
      }

    }
  }


  gridApp.controller('GridCtrl', GridCtrl);

})(angular, gridApp);

