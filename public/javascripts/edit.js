//Archtects simple editor for daily peel
let getOriginalContent;
let getUpdatedContent;
let setSelectedRange;
let getSelection = window.getSelection();

const config = { 
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true
};

let observer = new MutationObserver(function(mutations) { 
    mutations.forEach(function(mutation) {
        sortableCall();
        var newNodes = mutation.addedNodes; // DOM NodeList
        let getElementsCount = $('#editable-block').children().length;
        if (newNodes !== null) { // If there are new nodes added
            newNodes.forEach(function(node) {
                if(!node.classList.contains('ui-draggable-dragging') && node.classList.contains('ui-draggable')) {
                    addElementsToWrapper(node);
                }
            });
        }
    });   
}); 

$(window).bind("pageshow", function(event) {
    if($("#editable-block").length > 0) {
        sortableCall();
        observer.observe($("#editable-block")[0], config);
    }
});

$(window).on('resize', function() {
    if($("#edit-toolbar").length > 0) {
        $('#edit-toolbar').remove();
    }
});

$(document).on({
    mouseenter: function () {
        if(!$(".active-editing-toggle").length > 0) {
            $(this).addClass("to-edit");
            $(this).append('<div class="editable-button" id="editToggle"></div>');
            if($(this).attr("data-flow-is-post-target") == "true" && $("#editable-block").length > 0) { 
                $(this).append('<div class="editable-button" id="duplicateToggle"></div>');
                $(this).append('<div class="editable-button" id="removeToggle"></div>');
            }
        }
    },
    mouseleave: function () {
        $(this).children('#editToggle').remove();
        $(this).removeClass('to-edit');
        if($(this).attr("data-flow-is-post-target") == "true" && $("#editable-block").length > 0) {    
            $(this).children('#duplicateToggle').remove();
            $(this).children('#removeToggle').remove();
        }
    }
}, '[data-flow="is-editable"]');

$(document).on({
    "click": function() {
        if(!$(".active-editing-toggle").length > 0) {
            getOriginalContent = $(this).parent().find('span').html();
            $(this).parent().addClass('active-editing-toggle');
            $(this).parent().find('span').attr("contenteditable", "true");
            $(this).parent().append('<div class="editable-button" id="saveToggle" data-save-target=""></div>');
            $(this).parent().append('<div class="editable-button" id="cancelToggle"></div>');
            $('#editToggle').remove();
            $("#editable-block, .droptrue").sortable("disable");
        }
    }
}, '#editToggle');

$(document).on({
    "click": function() {
        if($(".active-editing-toggle").length > 0) {            
            getUpdatedContent = $(this).parent().find('span').html();
            if(getUpdatedContent != getOriginalContent) {
                let getColumnTarget = $(this).parent().find('span').attr("data-is-name");
                if($("#editable-block").length != 1) {
                    $.post("/auth/ajax/updateusermeta", {columnTarget: getColumnTarget, data: getUpdatedContent}, function(data) {
                        callToast(data[0], data[1], data[2]);
                    });
                }
                $(this).parent().removeClass('active-editing-toggle');
                $(this).parent().find('span').attr("contenteditable", "false");
                $('#edit-toolbar').remove();
                $('#saveToggle').remove();
                $('#cancelToggle').remove();
            }
            $("#editable-block, .droptrue").sortable("enable");
        }
    }
}, '#saveToggle');

$(document).on({
    "click": function() {
        if($(".active-editing-toggle").length > 0) {
            $(this).parent().find('span').html(getOriginalContent);
            $(this).parent().removeClass('active-editing-toggle');
            $(this).parent().find('span').attr("contenteditable", "false");
            $('#edit-toolbar').remove();
            $('#saveToggle').remove();
            $('#cancelToggle').remove();
        }
        $("#editable-block, .droptrue").sortable("enable");
    }
}, '#cancelToggle');


$(document).on({
    "click": function() {
        if($(".active-editing-toggle").length > 0) {
            let getExec = $(this).attr("data-type");
            AlterTextInline(getExec, $(this));
        }
    }
}, '#edit-toolbar button');

$(document).on({
    mouseup: function() {
        getSelectionText($(this));
    },
    keyup: function() {
        getSelectionText($(this));
    },
    selectionchange: function() {
        getSelectionText($(this));
    }
}, '[contenteditable="true"]');

$(document).on({
    "click": function() {
        if($(this).is(':empty')) {
            $("body").toggleClass("toggle-add-elements");
        }
    }
}, '[data-flow="add-elements"], .taggable');


$(document).on({
    "click": function() {
        const parseData = $("#editable-block").html();
        const parseTitle = $('[data-is-name="post-title"]').text();
        const parseCat = $('[data-is-name="category"]').text();
        const parsePostThumb = $('#post-thumb-nail').attr("src");
        $.post("/auth/ajax/publish", {postTitle: parseTitle, postCat: parseCat, postThumb: parsePostThumb, content: JSON.stringify(parseData)}, function(data) {
            callToast(data[0], data[1], data[2]);
        });
    }
}, 'button[data-flow="publish"]');


function AlterTextInline(exec, elem) {
    if(exec != "hyperlink" && exec != "addHyperlink" && exec != "closeHyperlink") {
        document.execCommand(exec);
    } else {
        if(exec == "hyperlink") {
            $("#edit-toolbar").addClass("addLink");
            setSelectedRange = getSelection.getRangeAt(0).cloneRange();
        } else {
            if(exec == "closeHyperlink") {
                $("#edit-toolbar").removeClass("addLink");
                elem.parent().find("input").val("");
                getSelection.removeAllRanges();
                getSelection.addRange(setSelectedRange);
            } else {
                let setHref = elem.parent().find("input").val();
                hyperlinkSelection(setHref, setSelectedRange);
                $("#edit-toolbar").removeClass("addLink");
                elem.parent().find("input").val("");
            }
        }
    }
}

function hyperlinkSelection(href, range) {
    var createLink = document.createElement("a");
    createLink.setAttribute('href', href);
    createLink.setAttribute('target', "_blank");
    createLink.setAttribute('rel', "nofollow");
    
    range.surroundContents(createLink);
    getSelection.removeAllRanges();
    getSelection.addRange(range);
}


function getSelectionText(getEl) {
    let checkAllowsEditor = getEl.parent().attr("data-allows-editor");
    if(checkAllowsEditor == "true") {
        let getText, getRange, getOutsideBounds;
        getText = getSelection.toString();
        getOutsideBounds = getEl.parent().width();
        if(getText.length > 0) {  
            getRange = getSelection.getRangeAt(0);
            getRange = getRange.getClientRects();
            let getheight = getRange[0].height;
            let x = getRange[0].x; 
            let y = getRange[0].y;
            y = y - getheight - 10;
            if(!$("#edit-toolbar").length > 0) {
                $('body').append('<div id="edit-toolbar" style="top: ' + y + 'px; left: ' + x + 'px; position: absolute;"><button type="button" data-type="bold">B</button><button type="button" data-type="underline">U</button><button type="button" data-type="italic">I</button><button type="button" data-type="hyperlink">H</button><div class="hyperlink-input"><input type="text" data-type="hyperlink-value"><button type="button" data-type="addHyperlink">✓</button><button type="button" data-type="closeHyperlink">x</button></div></div>')
            } else {
                $("#edit-toolbar").css({
                    "top": y,
                    "left": x,
                });
            }
        } else {
            if($("#edit-toolbar").length > 0) {
                $('#edit-toolbar').remove();
            }
            return;
        }
    }
}

function addElementsToWrapper(node) {
    let getType = $(node).attr("data-is-type");
    let getTarget = $(node).attr("data-id");

    $.getJSON("/javascripts/data/elementData.json").then(function(data) {
        let items = [];
        let promises = [];
        let val = data[getType][0];
        if (val) {
            let getWrapperElem = val["defaultWrapperStart"];
            let closeElements = val["defaultWrapperEnd"];
            let collectTarget = val[getTarget];

            if(getType == "content") {
                let promise = $.getJSON("/javascripts/data/randomData.json").then(function(data) {
                    let getContent;
                    let val = data[getTarget][0];
                    if (val) {
                        const count = Object.keys(val).length;
                        const randomNumber = Math.floor(Math.random() * count);
                        getContent = val[randomNumber];
                    }

                    items.push(getWrapperElem + collectTarget.replace("$#replacer", getContent) + closeElements);
                });
                promises.push(promise);
            } else {
                items.push(getWrapperElem + collectTarget + closeElements);
            }
        }

        $.when.apply($, promises).done(function() {
            $(items.join("")).insertAfter(node);
            $(node).remove();
        });
    });
}


function sortableCall() {
    $( "li[data-is-sortable='dragable-content']" ).draggable({
        cursor: "move",
        connectToSortable: ".sortable-items",
        helper: "clone",
        revert: "invalid"
    });
    
    $( "li[data-is-sortable='dragable-layout']" ).draggable({
        cursor: "move",
        connectToSortable: "#editable-block",
        helper: "clone",
        revert: "invalid"
    });
    
    $("li[data-is-sortable='dragable']").disableSelection();

    $( "#editable-block" ).sortable({
        placeholder: "ui-state-highlight",
        cancel: ".post-heading"
    });
    
    $( ".droptrue" ).sortable({
        connectWith: ".sortable-items",
        placeholder: "ui-state-content-highlight"
    });

}
