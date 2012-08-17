(function ($) {
    /**
     * Create a couple private variables.
    **/
    var selectOrigin,
    	activePalette,
        templates       = {
        	palette: $('<div class="select-shape-palette"></div>'),
            circle: $('<div class="palette-item palette-circle"></div>'),
            square: $('<div class="palette-item palette-square"></div>'),
            triangle: $('<div class="palette-item palette-triangle"></div>'),
            x: $('<div class="palette-item palette-x"></div>'),
        },
        lastShape;

    /**
     * Create our shapePicker function
    **/
    $.fn.shapePicker = function (options) {

        return this.each(function () {
            // Setup time. Clone new elements from our templates, set some IDs, make shortcuts, jazzercise.
            var element      = $(this),
                defaultShape =  element.attr("value") ? element.attr("value") : $.fn.shapePicker.defaults.pickerDefault,
                newPalette   = templates.palette.clone(),
                newCircle    = templates.circle.clone(),
                newSquare    = templates.square.clone(),
                newTriangle  = templates.triangle.clone(),
                newX	     = templates.x.clone();
			
			element.addClass("palette-" + defaultShape);
			element.val(defaultShape);
			
			newPalette.append(newCircle, newSquare, newTriangle, newX);
			element.append(newPalette);
			
			element.on("click", function() {
				$.fn.shapePicker.togglePalette($(this).children(".select-shape-palette"), $(this));
			});
			
			element.find(".palette-item").each(function(i, value) {
				$.fn.shapePicker.bindPalette($(value), $.fn.shapePicker.defaults.shapes[i]);
			});
			
			if (options && options.onShapeChange) {
				element.data("onShapeChange", options.onShapeChange);
            } else {
            	element.data('onShapeChange', function() {} );
			}
        });
    };

    /**
     * Extend shapePicker with... all our functionality.
    **/
    $.extend(true, $.fn.shapePicker, {
        checkMouse: function(e) {
        	if (e.target === selectorOwner[0] || $(e.target).parents(".select-shape").length > 0) {
                return;
            }
			
			// Hide palette
			$.fn.shapePicker.hidePalette();
        },

        showPalette: function(palette) {
        	palette.css({
				left: selectorOwner.offset().left,
				top: selectorOwner.offset().top + selectorOwner.outerHeight(),
			});
        
        	palette.show();
		
			$(document).on("mousedown", $.fn.shapePicker.checkMouse);
        },

		hidePalette: function() {
			$(document).off("mousedown", $.fn.shapePicker.checkMouse);
		
			$(".select-shape-palette").hide();
		},

        /**
         * Toggle visibility of the shapePicker palette.
        **/
        togglePalette: function(palette, origin) {
            selectorOwner = origin;
			activePalette = palette;

            if (activePalette.is(':visible')) {
                $.fn.shapePicker.hidePalette();
            } else {
            	$.fn.shapePicker.showPalette(palette);
            }
        },

        /**
         * Update the input with a newly selected shape.
        **/
        changeShape: function(value) {
        	selectorOwner.attr("class", "select-shape palette-" + value);
        	
            selectorOwner.val(value);

            $.fn.shapePicker.hidePalette();

            selectorOwner.data("onShapeChange").call(selectorOwner, $(selectorOwner).attr("id"), value);
        },


        /**
         * Preview the input with a newly selected color.
        **/
        previewShape: function(value) {
            selectorOwner.attr("class", "select-shape palette-" + value);
        },

        /**
         * Bind events to the shape palette items.
        */
        bindPalette: function(element, shape) {
            element.on({
                click: function(e) {
                    lastShape = shape;

                    $.fn.shapePicker.changeShape(shape);
                    
                    e.stopPropagation();
                },
                mouseover: function(e) {
                    lastShape = selectorOwner.val();

                	$.fn.shapePicker.previewShape(shape);
                },
                mouseout: function(e) {
                    $.fn.shapePicker.previewShape(lastShape);
                }
            });
        }
    });

    $.fn.shapePicker.defaults = {
    	shapes: [
            'circle', 'square', 'triangle', 'x'
        ],
    
        // shapePicker default selected shape.
        pickerDefault: "circle",
    };

})(jQuery);