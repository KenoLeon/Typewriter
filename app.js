
var Typewriter = {},
    util = loadUtilities();

Typewriter.init = function() {

    // This is to get around the weird highlighting
    // issues for contenteditable
    $('#input').append('<div id="start"><br></div>');

    // Initiate
    Typewriter.sync('output', 'input');

};

Typewriter.sync = function(oldNodeID, newNodeID) {
    
    console.log
    var newNode = document.getElementById(newNodeID),
        oldNode = document.getElementById(oldNodeID)
    
    ;

    // Update #output to reflect the changes made to #input
    return oldNode.innerHTML = newNode.innerHTML
};

$(function() {

    Typewriter.init();

    $(window).click(function(){
        window.setTimeout(function(){
            if (!util.getSelectionHtml()) {
                util.setEndOfContenteditable($('#input')[0]);
            };
        }, 150)
    });

    $('body').keydown(function(e){
        
        var keyCode = e.which;

        // Disable arrow keys
        if (keyCode <= 40 && keyCode >= 37) {
             e.preventDefault();             
        };

        if (keyCode === 13) {
            $('#input').append('<div><br></div>');
            e.preventDefault();
        };

        if (keyCode === 8) {
                
            // Don't delete anything, you can't delete words on a typewriter
            e.preventDefault();             

            // Strike out the text that would be deleted
            var strike = document.createElement('span'),
                span = document.createElement('span'),
                selectedText = window.getSelection().getRangeAt();
            
            strike.className = 'strikeout';
            span.innerHTML = '&#8203;';

            console.log(selectedText);

            selectedText.surroundContents(strike);
            selectedText.collapse(false);
            selectedText.insertNode(span);

            // Reflect strike in source textarea
             Typewriter.sync('input', 'output');
        };

        Typewriter.sync('output', 'input');
        util.setEndOfContenteditable('input');

    });

    $('#input')
        .focus()
        .keyup(function(e){Typewriter.sync('output', 'input')})
        .keypress(function(e){        
            $('#output div:last-child').append(String.fromCharCode(e.which));        
        });

});

function loadUtilities () {
    return {
        setEndOfContenteditable: function(elId) {
            var range,
                selection;

            var contentEditableElement = document.getElementById(elId);

            if (document.createRange) {
                range = document.createRange();
                range.selectNodeContents(contentEditableElement);
                range.collapse(false);
                selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        },

        getSelectionHtml: function() {
            var html = "";

            if (typeof window.getSelection != "undefined") {
                var sel = window.getSelection();
                if (sel.rangeCount) {
                    var container = document.createElement("div");
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        container.appendChild(sel.getRangeAt(i).cloneContents());
                    }
                    html = container.innerHTML;
                }
            }

            if (typeof document.selection != "undefined") {
                if (document.selection.type == "Text") {
                    html = document.selection.createRange().htmlText;
                }
            }

            return(html);            
        }
    }
};
