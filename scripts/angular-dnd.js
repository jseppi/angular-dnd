var ngdnd,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

ngdnd = angular.module('ngDnd', []);

ngdnd.directive('dndDraggable', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.attr('draggable', true);
      element.bind('dragstart', function(e) {
        var canDrag, dragModel, dt, fn, getter;

        if (attrs.dndCanDrag != null) {
          canDrag = $parse(attrs.dndCanDrag)(scope);
          if (!canDrag) {
            return;
          }
        }
        element.addClass('dragging');
        dt = e.originalEvent != null ? e.originalEvent.dataTransfer : e.dataTransfer;
        dt.effectAllowed = attrs.dndEffect != null ? attrs.dndEffect : 'copy';
        getter = $parse(attrs.dndDraggable);
        dragModel = getter(scope);
        dt.setData("application/" + attrs.dndContentType, angular.toJson(dragModel));
        if (attrs.dndDragstart != null) {
          fn = $parse(attrs.dndDragstart);
          scope.$apply(function() {
            fn(scope, {
              $event: e
            });
          });
        }
      });
    }
  };
});

ngdnd.directive('dndDropzone', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('dragover', function(e) {
        var dt, _ref;

        dt = e.originalEvent != null ? e.originalEvent.dataTransfer : e.dataTransfer;
        if (!((dt.types != null) && (_ref = "application/" + attrs.dndContentType, __indexOf.call(dt.types, _ref) >= 0))) {
          return;
        }
        if (e.preventDefault) {
          e.preventDefault();
        }
      });
      element.bind('dragenter', function(e) {
        var dt, _ref;

        dt = e.originalEvent != null ? e.originalEvent.dataTransfer : e.dataTransfer;
        if (!((dt.types != null) && (_ref = "application/" + attrs.dndContentType, __indexOf.call(dt.types, _ref) >= 0))) {
          return;
        }
        if (e.preventDefault) {
          e.preventDefault();
        }
        element.addClass('drag-over');
      });
      element.bind('dragleave', function(e) {
        var dt, _ref;

        dt = e.originalEvent != null ? e.originalEvent.dataTransfer : e.dataTransfer;
        if (!((dt.types != null) && (_ref = "application/" + attrs.dndContentType, __indexOf.call(dt.types, _ref) >= 0))) {
          return;
        }
        element.removeClass('drag-over');
      });
      element.bind('drop', function(e) {
        var dropData, dt, fn, _ref;

        dt = e.originalEvent != null ? e.originalEvent.dataTransfer : e.dataTransfer;
        if (!((dt.types != null) && (_ref = "application/" + attrs.dndContentType, __indexOf.call(dt.types, _ref) >= 0))) {
          return;
        }
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        dropData = dt.getData("application/" + attrs.dndContentType);
        dropData = angular.fromJson(dropData);
        if (attrs.dndDrop != null) {
          fn = $parse(attrs.dndDrop);
          scope.$apply(function() {
            fn(scope, {
              $dropped: dropData,
              $event: e
            });
          });
        }
      });
    }
  };
});
