$( document ).on( 'pagecreate', function() {
//// Store and process pebble data
    var dictionary;
    try {
	dictionary = JSON.parse(localStorage['pebble-autoconfig']);
    } catch(e) {
	dictionary = {};
    };
    if(!dictionary.hasOwnProperty('length')) {
	dictionary['length'] = '1';
    };
    previousLength = dictionary['length'];
    htmlMenu(previousLength);
    for (i = 0; i < dictionary['length']; i++) {
	if(!dictionary.hasOwnProperty('name'+i)) {
	    dictionary['name'+i] = 'Name';
	}
	$('#name'+i).val(dictionary['name'+i]);
	if(!dictionary.hasOwnProperty('webaddress'+i)) {
	    dictionary['webaddress'+i] = 'https://';
	}
	$('#webaddress'+i).val(dictionary['webaddress'+i]);
	$("#set").collapsibleset('refresh');
    };
//// Buttons and dynamic collapsible content:
    var nextId = 0;
    $('#add').click(function() {
        nextId++;
        $( '#set' ).append( content ).trigger( 'create' );
	reorderIDs();
    });
    
//// Dynamically change menu item names
    dynamicTitle();
    // Update Dynamic Titles after text input
    $('#set').on("focusout", ".name", function () {
	dynamicTitle();
    });
//// Handle different UI on i-devices
    if( /iPhone|iPad|iPod/i.test(navigator.userAgent) ) {
	$("#header").remove();
    }
    $("form :input").on("keypress", function(e) {
	return e.keyCode != 13;
    });
    
//// Swipe to delete:
    // Swipe to remove list item
    $( document ).on( "swipeleft swiperight", "#list li", function( event ) {
        var listitem = $( this ),
            // These are the classnames used for the CSS transition
            dir = event.type === "swipeleft" ? "left" : "right",
            // Check if the browser supports the transform (3D) CSS transition
            transition = $.support.cssTransform3d ? dir : false;
            confirmAndDelete( listitem, transition );
    });
    // Or use delete button
    $( "#set" ).on( "click", ".delete", function(e) {
            var listitem = $( this ).closest( "li" );
            confirmAndDelete( listitem );
        });
    function confirmAndDelete( listitem, transition ) {
        // Highlight the list item that will be removed
        listitem.children().find( ".ui-collapsible-heading-toggle" ).css( "background","red" );
        // Inject topic in confirmation popup after removing any previous injected topics
        $( "#confirm .topic" ).remove();
        listitem.find( ".topic" ).clone().insertAfter( "#question" );
        // Show the confirmation popup
        $( "#confirm" ).popup( "open" );
        // Proceed when the user confirms
        $( "#confirm #yes" ).on( "click", function() {
            // Remove with a transition
            if ( transition ) {
                listitem
                    // Add the class for the transition direction
                    .addClass( transition )
                    // When the transition is done...
                    .on( "webkitTransitionEnd transitionend otransitionend", function() {
                        // ...the list item will be removed
                        listitem.remove();
                        // ...the list will be refreshed and the temporary class for border styling removed
                        $( "#list" ).listview( "refresh" ).find( ".border-bottom" ).removeClass( "border-bottom" );
                    })
                    // During the transition the previous button gets bottom border
                    .prev( "li" ).children( "a" ).addClass( "border-bottom" )
                    // Remove the highlight
                    .end().end().children().find( ".ui-collapsible-heading-toggle" ).removeAttr( "style" );
            }
            // If it's not a touch device or the CSS transition isn't supported just remove the list item and refresh the list
            else {
                listitem.remove();
                $( "#list" ).listview( "refresh" );
            }
	    // Reorder the IDs, names, and labels
	    reorderIDs();
        });
        // Remove active state and unbind when the cancel button is clicked
        $( "#confirm #cancel" ).on( "click", function() {
            listitem.children().find( ".ui-collapsible-heading-toggle" ).removeAttr( "style" );
            $( "#confirm #yes" ).off();
        });
    }
    // Fix ID numbering for persistant data
    $.each($('#set .name'), function () {
	nextId++;
    });
//// Submit or Cancel
    $('#b-submit, #b-save').click(function() {
	var dictionary = {};
	dictionary['length'] = $('li').length;
	for (i = 0; i < dictionary['length']; i++) {
	    dictionary['name'+i] = $('#name'+i).val();
	    dictionary['webaddress'+i] = $('#webaddress'+i).val();
	};
	localStorage['pebble-autoconfig'] = JSON.stringify(dictionary);
	var location = "pebblejs://close#" + encodeURIComponent(localStorage['pebble-autoconfig']);
	window.location.href = location;
    });
    $('#b-cancel').click(function() {
	var location = "pebblejs://close#";
	window.location.href = location;
    });
}); // <- End of pagecreate function
var content = '<li><div data-role="collapsible" class="collapse"><h3 class="ui-btn-text" id="dynamicName">Menu Item</h3><div class="ui-field-contain"><label>Name<input type="text" class="name" id="name" value="" maxlength="15" data-clear-btn="true" ></label></br></br><label>Web Request<input type="text" class="webaddress" id="webaddress" value="" data-clear-btn="true" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></label><a href="#" class="delete ui-btn" title="Delete">Delete</a></div></div></li>';
var reorderIDs = function () {
    $.each($('#set .name'), function (index,value) {
	$(this).attr('id','name'+index);
	});
    $.each($('#set .webaddress'), function (index,value) {
	$(this).attr('id','webaddress'+index);
	});
    $.each($('#set .ui-btn-text'), function (index,value) {
	$(this).attr('id','dynamicName'+index);
	});
}
var htmlMenu = function(numMenu) {
    for (i = 0; i < numMenu; i++) {
	$( '#set' ).append( content ).trigger( 'create' );
	reorderIDs();
    }
};
var dynamicTitle = function () {
    $('#set .ui-collapsible-heading-toggle').each(function (i) {
	if ($('#name'+i).val() !== "") {
	    $('#set #dynamicName'+i+' .ui-collapsible-heading-toggle').text($('#name'+i).val());
	} else {
	    $('#set #dynamicName'+i+' .ui-collapsible-heading-toggle').text('Menu Item');
	};
	i++
    });
};