gridApp.directive('grid', function () {
  "use strict";
  return {
    restrict:   'E',
    scope: {
      head: '=head',
      rows: '=rows',
      pageSize: '=pageSize'
    },

    templateUrl: "./tpl/grid.html",
    compile: function (tElement, tAttrs, transclude) {

      return function (scope, element, attrs) {
        scope.MAX_PAGES_TO_SELECT = 5;
        scope.orderProp = "";
        scope.orderReverse = false;
        scope.currentPage = 1;
        scope.filterValue = undefined;
        scope.selectedRow = undefined;

        // Сброс страницы на один если изменился размер данных, не очень
        // верно в принципе, но пока это самый простой способ реагировать на
        // измения извне
        scope.$watch(function (rows) {
          return scope.rows && scope.rows.length;
        }, function (newValue, oldValue) {
          if (newValue === oldValue) return;
          scope.currentPage = 1;
          scope.filterValue = "";
        });

        scope.getPages = function () {
          if (!scope.rows || !scope.rows.length) return;
          var pages = [],
              pageIx,
              TOTAL_PAGES = scope.getTotalPages(),
              LEFT_PAGE_AMOUNT = Math.floor(scope.MAX_PAGES_TO_SELECT/2),
              minPage,
              maxPage,
              currentPage = scope.currentPage;

          minPage = currentPage - LEFT_PAGE_AMOUNT;
          if (minPage < 1) {
            minPage = 1;
          }

          maxPage = minPage + scope.MAX_PAGES_TO_SELECT - 1;
          if (maxPage > TOTAL_PAGES) {
            maxPage = TOTAL_PAGES;
            minPage = maxPage - scope.MAX_PAGES_TO_SELECT + 1;
            if (minPage < 1) {
              minPage = 1;
            }
          }

          for (pageIx = minPage; pageIx < maxPage + 1; pageIx++) {
            pages.push(pageIx);
          }

          return pages;
        }

        scope.getTotalPages = function () {
          return Math.ceil(scope.rows.length / scope.pageSize);
        }

        scope.next = function () {
          scope.selectPage(scope.currentPage + 1);
        }

        scope.prev = function () {
          scope.selectPage(scope.currentPage - 1);
        }

        scope.getNextClass = function () {
          if (scope.currentPage == scope.getTotalPages) {
            return "disabled"
          }
          return "";
        }

        scope.getPrevClass = function () {
           if (scope.currentPage == 1) {
            return "disabled"
          }
          return "";
        }

        scope.selectPage = function(page) {
          var TOTAL_PAGES = Math.ceil(scope.rows.length / scope.pageSize);
          if (page > TOTAL_PAGES || page < 1) {
            return;
          }
          scope.currentPage = page;
        }

        scope.selectRow = function(row) {
          scope.selectedRow = row;
        }

        scope.getPaginationClass = function(page) {
          var paginationClass = "";
          if (page == scope.currentPage) {
            paginationClass = "active";
          }
          return paginationClass;
        }

        scope.getSortProp = function (row) {
          var NOT_FOUND = -1;
          var ix = Object.find(scope.head, function (headCell) {
            return headCell.name === scope.orderProp;
          });
          if (ix === NOT_FOUND) return;
          return row[ix].value;
        }

        scope.selectOrderProp = function (name) {
          var negSign;
          if (scope.orderProp === name) {
            scope.orderReverse = !scope.orderReverse;
          }
          else {
            scope.orderProp = name;
            scope.orderReverse = false;
          }
        };

        scope.getIconSortClass = function(name) {
          var NOT_FOUND = -1,
              sortClass ="icon-sort",
              sortPostfixDirection = "";
          if (scope.orderProp.search(name)!== NOT_FOUND) {
            sortPostfixDirection = (scope.orderReverse)?('-up'):('-down');
          }
          return sortClass + sortPostfixDirection;
        }

      }

    }
  }
});

