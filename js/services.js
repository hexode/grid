(function (gridApp) {
  gridApp.service('DataSrvc', function ($http) {

    var DataSrvc = function () {
      this.http = $http;
      this.config = {
        transformResponse: function (data) {
          // TOFIX: JSON BAD FORMAT, USAGE OF EVAL IS VERY BAD
          return eval(data);
        }
      };
      this.resourceUrl = 'http://thethz.com/dataset.php?type=#{type}';
      this.dataStorage = {
        'small': null,
        'large':  null,
        'custom': [
            [
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
                name: "quantity",
                title: "Количество",
                type: "number"
              }
            ],

            [ 1, 'iPhone 5',  '400', 5 ],
            [ 2, 'XBOX',      '300', 7 ],
            [ 3, 'PS3',       '350', 2 ],
            [ 4, 'MAC AIR',   '1350', 2 ]
          ]
      };
    };

    DataSrvc.prototype.get = function (type) {
      dataStorage = this.dataStorage;
      if (!type) return;
      if (dataStorage[type] === null) {
        var url = this.resourceUrl.replace('#{type}', type);
        dataStorage[type] = this.http.get(url, this.config).success(function (data) {
          dataStorage[type] = data;
        });
      }
      else if (dataStorage[type] === undefined) {
        throw new Error("Unknow type of dataset");
      }

      return dataStorage[type];
    };

    return new DataSrvc();
  });
})(gridApp)



