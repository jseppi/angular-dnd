
ngdnd = angular.module 'ngDnd', []

#TODO: Maybe don't assume that it is an object being DnD'd, so don't always use to/fromJson

# dndDraggable - model to attach to drag event
# dndContentType - type name to use in content encoding string
# dndDragstart - optional, callback for dragstart
# dndEffect - optional, draganddrop effectAllowed (defaults to 'copy')
ngdnd.directive 'dndDraggable', ($parse) ->
    return {
        restrict: 'A'
        
        link: (scope, element, attrs) ->
            element.attr('draggable', true)
            
            element.bind('dragstart', (e) ->
                element.addClass('dragging')

                dt = if e.originalEvent? then e.originalEvent.dataTransfer else e.dataTransfer 

                dt.effectAllowed = if attrs.dndEffect? then attrs.dndEffect else 'copy'

                getter = $parse(attrs.dndDraggable)
                dragModel = getter(scope)

                dt.setData(
                    "application/#{attrs.dndContentType}", 
                    angular.toJson(dragModel)
                )

                if attrs.dndDragstart?
                    fn = $parse(attrs.dndDragstart)
                    scope.$apply(() ->
                        fn(scope, {$event:e})
                        return
                    )

                return
            )
            return
    }

# dndContentType - type name to use in content encoding string
# dndDrop - callback for drop event. Dropped object available as $dropped
ngdnd.directive 'dndDropzone', ($parse) ->
    return {
        restrict: 'A'
            
        link: (scope, element, attrs) ->
            element.bind('dragover', (e) ->
                dt = if e.originalEvent? then e.originalEvent.dataTransfer else e.dataTransfer

                unless "application/#{attrs.dndContentType}" in dt.types
                    return

                e.preventDefault() if e.preventDefault
                return
            )

            element.bind('dragenter', (e) ->
                dt = if e.originalEvent? then e.originalEvent.dataTransfer else e.dataTransfer 
                
                unless "application/#{attrs.dndContentType}" in dt.types
                    return
                e.preventDefault() if e.preventDefault
                element.addClass('drag-over')
                return
            )

            element.bind('dragleave', (e) ->
                dt = if e.originalEvent? then e.originalEvent.dataTransfer else e.dataTransfer 
                
                unless "application/#{attrs.dndContentType}" in dt.types
                    return

                element.removeClass('drag-over')
                return
            )

            element.bind('drop', (e) ->
                dt = if e.originalEvent? then e.originalEvent.dataTransfer else e.dataTransfer 
                
                unless "application/#{attrs.dndContentType}" in dt.types
                    return

                e.stopPropagation() if e.stopPropagation
                dropData =  dt.getData(
                    "application/#{attrs.dndContentType}")
                dropData = angular.fromJson(dropData)
                
                #callback to onDrop handler in directive
                if attrs.dndDrop?
                    fn = $parse(attrs.dndDrop)
                    scope.$apply(() ->
                        fn(scope, {$dropped: dropData, $event:e})
                        return
                    )
                return
            )

            return
    }