function sortableCall() {
    $( ".droptrue" ).sortable({
      connectWith: ".sortable-items-wrapper",
    });
}

function generateRandomEditTag() {
    var d = new Date();
    var newstr = d.getMonth() + "" + d.getFullYear() + "" + d.getDay() + "" +  d.getHours()  + "" +  d.getSeconds()  + "" +  d.getMilliseconds();
    return newstr;
}

function editMainFunction(thisItem) {
    $('[data-target="*"]').removeClass('active unactive-DOM-elment');
    var newstr = generateRandomEditTag();
    let thisitem = thisItem;
    
    let flowTarget = thisitem.parent().parent().attr('data-flow');
    let tomanipulateTarget = thisitem.parent().siblings();
    let getClasses = tomanipulateTarget.attr('class');

    let hasStyle = tomanipulateTarget.css('color');
    if(hasStyle == undefined) { 
        tomanipulateTarget.css('color', '#000000');
        hasStyle = tomanipulateTarget.css('color');
    }
    
    $('.manipulateDOMmenu[data-target=' + flowTarget + '] input[data-item="manipulatetextcolor"]').val(hasStyle);

    let hasFontSize = tomanipulateTarget.css('font-size')
    let hasImageSize = tomanipulateTarget.find('img').css('max-width')

    $('.manipulateDOMmenu[data-target=' + flowTarget + '] input[data-item="manipulatefontstyle"]').val(hasFontSize.replace('px', ''));

    $('.manipulateDOMmenu[data-target=' + flowTarget + '] input[data-item="manipulatefontspacing"]').each(function() { //loops through inputs and gets the class's
        let getStyleTag = $(this).attr('data-style');
        let hasSpacingStyle = tomanipulateTarget.css(getStyleTag);
        $(this).val(hasSpacingStyle);
    });
    //error log
    if(typeof getClasses !== "undefined") {
        var findtargetClassList = getClasses.split(/\s+/);
        $.each(findtargetClassList, function(index, item) {
            $('[data-class="' + item + '"]').addClass('active');
        });
    }

    tomanipulateTarget.addClass('manipulationFlowDOMExpandId' + newstr);
    $('.manipulateDOMmenu').removeClass('active');
    $('#manipulateelementshtmlwrapper').addClass('active');
    $('.manipulateDOMmenu[data-target=' + flowTarget + ']').addClass('active');

    $('.manipulateDOMmenu[data-target=' + flowTarget + '] div.clr-field').css('color', hasStyle);
    hasStyle = hasStyle.replace('color: ', '').replace(';', ''); //Todo replace this is dumb

    $('.manipulateDOMmenu[data-target=' + flowTarget + '] input[data-item="manipulatetextcolor"]').val(hasStyle);

    if(flowTarget == "reviews") {
        let findtargetDataList = $(".manipulateDOMmenu[data-target=" + flowTarget + "]").find('input');
        $.each(findtargetDataList, function(index, item) {
            let getAttrtarget = $(this).attr('data-add');
            let getAttrValueFromTarget = $(".manipulationFlowDOMExpandId" + newstr).attr(getAttrtarget)
            $(this).val(getAttrValueFromTarget);
            $('[data-add=' + getAttrtarget + ']').parent().css('color', getAttrValueFromTarget);
        });
    }
    if(flowTarget == "heading") {
        if($("#designflowcollector h1").length) { //Check if h1 exists already.
            $('.manipulateDOMmenu[data-target=' + flowTarget + '] li[data-class="h1"]').addClass('unactive-DOM-elment');
        } else if($("#designformflowcollector h1").length) {
            $('.manipulateDOMmenu[data-target=' + flowTarget + '] li[data-class="h1"]').addClass('unactive-DOM-elment');
        }
    }
    if(flowTarget == "image") {
        $('.manipulateDOMmenu[data-target=' + flowTarget + '] input[data-item="manipulateimagestyle"]').val(hasImageSize.replace('px', ''));
        $('.manipulateDOMmenu[data-target=' + flowTarget + ']').find('[data-item="manipualteimage"]').val(tomanipulateTarget.find("img").attr("src"));
    }
    if(flowTarget == "anchor") {
        $('.manipulateDOMmenu[data-target=' + flowTarget + ']').find('[data-item="anchortarget"]').val(tomanipulateTarget.attr("href"));
    }
    if(flowTarget == "video") {
        $('.manipulateDOMmenu[data-target=' + flowTarget + ']').find('[data-item="manipualtevideo"]').val(tomanipulateTarget.find("source").attr("src"));
    }
    if(flowTarget == "list") {
        $('.manipulateDOMmenu[data-target=' + flowTarget + ']').find('div').first().find('label').remove();
        $('.manipulationFlowDOMExpandId' + newstr + ' li').each(function(){
            let getTarget = $(this).attr('data-sub-target');
            let getTargetValue = $(this).text();
            $('.manipulateDOMmenu[data-target=' + flowTarget + ']').find('div').first().append('<label class="list-input-wrap"><input type="text" data-flow="manipualtlist" data-target="manipulationFlowDOMExpandId' + newstr + '" data-item="manipulatetext" data-has="list" data-sub-target="' + getTarget + '" value="' + getTargetValue + '"><span class="manipulateDOMaddlistitembtn"></span><span class="manipulateDOMremovelistitembtn"></span></label>');
        });
    } else {
        $('.manipulateDOMmenu[data-target=' + flowTarget + ']').find('[data-item="manipulatetext"]').val(tomanipulateTarget.text());
    }
    $('.manipulateDOMmenu[data-target=' + flowTarget + ']').find('[data-target]').attr('data-target', 'manipulationFlowDOMExpandId' + newstr);
}

$(document).on({ //TODO differantiate between rows and content
    mouseenter: function () {
        $(this).append("<div id='edit-selector-wrap'><span id='move-item-selector'></span><span id='edit-item-selector'></span><span id='delete-item-selector'></span></div>");
        $(this).addClass('this-targeted-edit-selector');
        $('.taggable').addClass('droptrue sortable-items-wrapper ui-sortable');
    },
    mouseleave: function () {
        $(this).children('#edit-selector-wrap').remove();
        $(this).removeClass('this-targeted-edit-selector');
        $('.taggable').removeClass('droptrue sortable-items-wrapper ui-sortable');
    }
}, "#designflowcollector .editableTargetSelector, #designformflowcollector .editableTargetSelector"); //pass the element as an argument to .on always wrapper.
//editableRowTargetSelector

$(document).on({
    mouseenter: function () {
        $(this).append("<div id='edit-selector-wrap'><span id='move-item-selector'></span><span id='edit-row-item-selector'></span><span id='delete-item-selector'></span></div>");
        $(this).addClass('this-targeted-edit-selector this-targeted-edit-row-selector');
        $('.sortable-wrappers').addClass('droptrue sortable-items-wrapper ui-sortable');
    },
    mouseleave: function () {
        $(this).children('#edit-selector-wrap').remove();
        $(this).removeClass('this-targeted-edit-selector this-targeted-edit-row-selector');
        $('.sortable-wrappers').removeClass('droptrue sortable-items-wrapper ui-sortable');
    }
}, "#designflowcollector .editableRowTargetSelector, #designformflowcollector .editableRowTargetSelector"); //pass the element as an argument to .on always wrapper.

//TODO = Make An undo Button (dont delete move with an ID to a hidden div)
//edit-row-item-selector
//mousedown button remove item
$(document).on({
    mousedown: function() {
        $(this).parent().parent().remove();
        //sortableCall();
    }
}, "#designflowcollector .editableTargetSelector #edit-selector-wrap #delete-item-selector, #designflowcollector .editableRowTargetSelector #edit-selector-wrap #delete-item-selector, #designformflowcollector .editableTargetSelector #edit-selector-wrap #delete-item-selector, #designformflowcollector .editableRowTargetSelector #edit-selector-wrap #delete-item-selector");

//Mouse down editboxes TODO: Make more universal reusing multi functions for different builds lazy.
$(document).on({    //manipulatetext
    mousedown: function() {
        editMainFunction($(this));
    }
}, "#designflowcollector .editableTargetSelector #edit-selector-wrap #edit-item-selector");

$(document).on({    //manipulatetext
    dblclick: function() {
        editMainFunction($(this).find("#edit-item-selector"));
    }
}, "#designflowcollector .editableTargetSelector");

//Mouse down editboxes text
$(document).on({    
    mousedown: function() {//TODO make function to lazy
        var newstr = generateRandomEditTag();
        
        let flowTarget = $(this).parent().parent().attr('data-flow');
        let tomanipulateTarget = $(this).parent().siblings();

        tomanipulateTarget.addClass('manipulationFlowDOMExpandId' + newstr);

        $('.manipulateDOMmenu').removeClass('active');
        $('#manipulateelementshtmlwrapper').addClass('active');
        $('.manipulateDOMmenu[data-target=' + flowTarget + ']').addClass('active');

        let findtargetInput = $('.manipulateDOMmenu[data-target=' + flowTarget + ']').find('input')

        $.each(findtargetInput, function(index, item) {
            let targetStyle = $(item).attr('data-style');
            if(targetStyle !== '') {
                let valueStyle = tomanipulateTarget.css(targetStyle);
                $(item).val(valueStyle);
                if(targetStyle == 'background-color') {
                    $('.manipulateDOMmenu[data-target=' + flowTarget + '] div.clr-field').css('color', valueStyle);
                }
            }
            if($(this).attr('data-item') == "setuniqueid") {
                let getID = tomanipulateTarget.attr('id');
                $(item).val(getID);
            }
        });
        

        $('.manipulateDOMmenu[data-target=' + flowTarget + ']').find('[data-target]').attr('data-target', 'manipulationFlowDOMExpandId' + newstr); //always at end.
    }
}, "#designflowcollector .editableRowTargetSelector #edit-selector-wrap #edit-row-item-selector");

//on Grab
$(document).on({
    mousedown: function() {
        $(this).addClass('grabbing');
        //sortableCall();
    },
    mouseup: function() {
        $(this).removeClass('grabbing');
    }
}, "#designflowcollector .editableTargetSelector #edit-selector-wrap #move-item-selector, #designflowcollector .editableRowTargetSelector #edit-selector-wrap #move-item-selector");

//list-items
$(document).on({
    mousedown: function() {
        let getTarget = $(this).siblings().attr('data-target');
        let getSubTarget = $(this).siblings().attr('data-sub-target');

        var createNewItemNumber;
        if($('input[data-sub-target=' + getSubTarget + '][data-target=' + getTarget + ']').length !== 0) {
            var newstr = generateRandomEditTag();
            createNewItemNumber = createNewItemNumber + newstr;
        }
        $(this).parent().parent().append('<label class="list-input-wrap"><input type="text" data-flow="manipualtlist" data-target="' + getTarget + '" data-item="manipulatetext" data-has="list" data-sub-target="list' + createNewItemNumber + '" value="List Item"><span class="manipulateDOMaddlistitembtn"></span><span class="manipulateDOMremovelistitembtn"></span></label>');
        $('.' + getTarget).append('<li data-sub-target="list' + createNewItemNumber + '">List Item</li>')
    }
}, ".manipulateDOMaddlistitembtn");


$(document).on({
    'input': function() {
            let getTarget = $(this).attr('data-target');
            let hasItem = $(this).attr('data-has');
            if(hasItem == 'list') {
                let getSubTarget = $(this).attr('data-sub-target');
                $('li[data-sub-target="' + getSubTarget + '"]').text($(this).val());
            } else {
                $('.' + getTarget).text($(this).val());
            }
    }
}, '.manipulateDOMmenu .active [data-item="manipulatetext"]');

//move to reusable function.
$(document).on({
    'input': function() {
            let getTarget = $(this).attr('data-target');
            $('.'+ getTarget).attr('href', $(this).val());
    }
}, '.manipulateDOMmenu .active [data-item="anchortarget"]');

//move to reusable function.
$(document).on({
    'input': function() {
            let getTarget = $(this).attr('data-target');
            $('.'+ getTarget).css('color', $(this).val());
    }
}, '.manipulateDOMmenu .active [data-item="manipulatetextcolor"]');


//move to reusable function.

$(document).on({
    mousedown: function() {
            let getTarget = $(this).attr('data-target');
            let getStyleTag = $(this).attr('data-style');
            let getStyle = $(this).attr('data-value');
            $('.'+ getTarget).css(getStyleTag, getStyle);
            console.log($('.'+ getTarget).css(getStyleTag, getStyle));
    }
}, '.manipulateDOMmenu .active [data-item="fontweightItem"]');

$(document).on({
    'input': function() {
            let getTarget = $(this).attr('data-target');
            let getStyleTag = $(this).attr('data-style');
            $('.'+ getTarget).css(getStyleTag, $(this).val());
    }
}, '.manipulateDOMmenu .active [data-item="manipulatecolumnstyle"]');

//manipulatecolumnbackgroundstyle

//you suck make reusable function
$(document).on({
    'input': function() {
            let getTarget = $(this).attr('data-target');
            let getStyleTag = $(this).attr('data-style');
            $('.'+ getTarget).find('img').css(getStyleTag, $(this).val() + 'px');
    }
}, '.manipulateDOMmenu .active [data-item="manipulateimagestyle"]');


$(document).on({
    'input': function() {
            let getTarget = $(this).attr('data-target');
            let getStyleTag = $(this).attr('data-style');
            $('.'+ getTarget).css(getStyleTag, $(this).val() + 'px');
    }
}, '.manipulateDOMmenu .active [data-item="manipulatefontstyle"]');

//reusable function plz
$(document).on({
    'input': function() {
            let getTarget = $(this).attr('data-target');
            let getStyleTag = $(this).attr('data-style');
            $('.'+ getTarget).css(getStyleTag, $(this).val());
    }
}, '.manipulateDOMmenu .active [data-item="manipulatefontspacing"]');

$(document).on({
    'input': function() {
            let getTarget = $(this).attr('data-target');
            let getAttributeToAdd = $(this).attr('data-add');
            $('.'+ getTarget).attr(getAttributeToAdd, $(this).val());
    }
}, '.manipulateDOMmenu .active [data-item="manipualteReviewColor"]');

//manipualtuniqueid

$(document).on({
    'input': function() {
            let getTarget = $(this).attr('data-target');
            $('.'+ getTarget).attr("id", $(this).val());
    }
}, '.manipulateDOMmenu .active [data-item="setuniqueid"]');

//change element
$(document).on({
    mousedown: function() {    
        let getTarget = $(this).attr('data-target');
        let getElement = $(this).attr('data-element');
        if(getElement == "h1") {
            if($("#designflowcollector h1").length) { //Check if h1 exists already. Add Popup to say only 1 h1 can be used on per page.
                return;
            } else if($("#designformflowcollector h1").length) {
                return;
            }
        }
        //This is vomit, make it better
        let getTargetClass = $('.'+ getTarget).attr('class'); //get replaceable classes
        let getTargetStyles = $('.'+ getTarget).attr('style'); //get replaceable styles
        let getTargettext = $('.'+ getTarget).text(); //get replaceable text
        $('.'+ getTarget).replaceWith('<' + getElement + ' class="' + getTargetClass + '" style="' + getTargetStyles +'">' + getTargettext + '</' + getElement + '>' );
    }
}, '.manipulateDOMmenu .active [data-swap="domelements"]');

// $('.manipulateDOMmenu .active [data-item="manipulatetext"]').on("input", function() {
// });

//list remove

$(document).on({
    mousedown: function() {    
        let getTarget = $(this).siblings().attr('data-sub-target');
        $(this).parent().remove();
        $('li[data-sub-target="' + getTarget + '"]').remove()
    }
}, ".manipulateDOMremovelistitembtn");

//<label class="list-input-wrap"><input type="text" data-flow="manipualtlist" data-target="manipulationFlowDOMExpandId020241126612" data-item="manipulatetext" data-has="list" data-sub-target="list1"><span class="manipulateDOMaddlistitembtn"></span></label>

$(window).on('scroll', function () {
    if($("#formtarget").length > 0) {
        let scrollTop = $(window).scrollTop();
        let elementOffset = $('#formtarget').offset().top;
        let distance = (elementOffset - scrollTop);
        if(distance > 0) {
            $('#designEditFlow, #formEditFlow, #manipulateelementsformwrapper, #manipulateelementshtmlwrapper').css('top', distance + 'px');
        } else {
            if($('#designEditFlow, #formEditFlow, #manipulateelementsformwrapper, #manipulateelementshtmlwrapper').css('top') != '0px') {
                $('#designEditFlow, #formEditFlow, #manipulateelementsformwrapper, #manipulateelementshtmlwrapper').css('top', '0px');
            }
        }
    }
    //console.log(distance);
});

//general
$(function () {

    var attrcheck = $("#outerDesignFlowForm").attr("data-background-image");

    if (attrcheck !== 'undefined') {
        $("#outerDesignFlowForm").css('background-image', 'url(' + attrcheck + ')');
        $("#outerformFlow").css('background-image', 'url(' + attrcheck + ')');
    }

    $(".optionselection").each(function() {
        let value = $(this).attr('data-selected-value');
        $(this).val(value);
    });

    $(".close-DOM-editmenu").on("click", function(e) {
        let getTarget = $(this).attr('data-target');
        $('#manipulateelementshtmlwrapper').removeClass('active');
        $('.manipulateDOMmenu').removeClass('active');
        $('.' + getTarget).removeClass(getTarget);
        $('[data-target="' + getTarget + '"]').removeClass('active unactive-DOM-elment');
        $('[data-target="' + getTarget + '"]').attr('data-target', 'none');
        $('input[data-flow="manipualterequired"]').prop("checked", false);
        return false;
    });

    //fontOptionSelector
    $('.fontOptionSelector').on('change', function() {
        let getPrefixItem = $(this).attr('data-class');
        let getClassNameToAppend = $("select[data-class='" + getPrefixItem + "'] option:selected").data('class');
        //#designformflowcollector , #designflowcollector
        $('[class*=' + getPrefixItem  + ']').each(function(index) {
            var classArray = $(this).attr('class').split(' ');
            $.each(classArray, function( key, value ) {
                if(value.includes(getPrefixItem)) {
                    $('.' + value).removeClass(value);
                }
            });
        });
        $('#designformflowcollector').addClass(getPrefixItem + '-' + getClassNameToAppend);
        $('#designflowcollector').addClass(getPrefixItem + '-' + getClassNameToAppend);
    });

    //TODO move to document
    $('#manipulateelementshtmlwrapper li, #manipulateelementsformwrapper li').on("click", function() {
        let classToadd = $(this).attr('data-class');
        let dataFlow = $(this).attr('data-flow');
        let itemTarget = $(this).attr('data-target');
        if(dataFlow == "single") {
            if($(this).attr('data-has') == "anchorbutton") {
                console.log($(this).attr('data-has'));
                $(this).siblings().removeClass('active');
                $(this).siblings().each(function() {
                    $('.' + itemTarget).parent().removeClass($(this).attr('data-class'));
                });

            } else {
                $(this).siblings().removeClass('active');
                $(this).siblings().each(function() {
                    $('.' + itemTarget).removeClass($(this).attr('data-class'));
                });
            }
        }
        if($(this).hasClass('active')) {
            $(this).removeClass('active');
            $('.' + itemTarget).removeClass(classToadd);

        } else {
            $(this).addClass('active');
            if($(this).attr('data-has') == "anchorbutton") {
                $('.' + itemTarget).parent().addClass(classToadd);
            } else {
                $('.' + itemTarget).addClass(classToadd);
            }
        }
    });

    $("#manipulateelementshtmlwrapper ul .toggle, #manipulateelementsformwrapper ul .toggle").on("click", function() {
        $("#manipulateelementshtmlwrapper ul .toggle, #manipulateelementsformwrapper ul .toggle").removeClass('active');
        $("#manipulateelementshtmlwrapper ul div, #manipulateelementsformwrapper ul div").removeClass('active');
        $(this).addClass('active');
        $(this).next().addClass('active');
    });

    //TODO make more streamline
    $(".toggleedititems").on("click", function() {
        let getTargetToggle = $(this).attr("data-flow");
        let targetItem = $('.design-flow-block-items[data-target="' + getTargetToggle + '"]');
        if(targetItem.hasClass('active')) { 
            $(this).removeClass('active');
            targetItem.removeClass('active');
        } else {
            $('.toggleedititems').removeClass('active');
            $('.design-flow-block-items').removeClass('active');
            $(this).addClass('active');
            targetItem.addClass('active');
        }
    });

    $(".viewport-toggle-item").on("click", function() {
        let getClasstoAdd = $(this).attr('data-class');
        $(".viewport-toggle-item").removeClass('active');
        $(this).addClass("active");
        $("#designflowcollector").removeClass(["desktop-viewport", "tablet-viewport", "mobile-viewport"]);
        $("#designflowcollector").addClass(getClasstoAdd);
    });

    $(".additemtowrapper").on("click", function() {
        $("#addElements").removeClass('active');
        $('#addelementshtmlwrapper').removeClass('active');
        let elementToCreate = $(this).attr('data-elem');
        let elementHas = $(this).attr('data-has');
        let createdElementToAppend;
        //TODO Json it in a for loop this looks to messy. and unreadable 
        if(elementToCreate == 'row') {
            createdElementToAppend = '<div data-flow="sortable-wrappers" class="sortable-wrappers"><div data-flow="column-target-wrap" class="editableRowTargetSelector"><section class="row-design-item  padded-design-item taggable" style="background-color: rgba(255, 255, 255, 0);;"></section></div></div>';
        }

        if(elementToCreate == 'two-col') {
            createdElementToAppend = '<div data-flow="sortable-wrappers" class="sortable-wrappers"><div data-flow="column-target-wrap" class="editableRowTargetSelector"><section class="row-design-item  padded-design-item col-container" style="background-color: rgba(255, 255, 255, 0);;"><div class="two-col taggable"></div><div class="two-col  taggable"></div></section></div></div>';
        }

        if(elementToCreate == 'three-col') {
            createdElementToAppend = '<div data-flow="sortable-wrappers" class="sortable-wrappers"><div data-flow="column-target-wrap" class="editableRowTargetSelector"><section class="row-design-item  padded-design-item col-container" style="background-color: rgba(255, 255, 255, 0);;"><div class="three-col  taggable"></div><div class="three-col  taggable"></div><div class="three-col  taggable"></div></section></div></div>';
        }

        if(elementToCreate == 'four-col') {
            createdElementToAppend = '<div data-flow="sortable-wrappers" class="sortable-wrappers"><div data-flow="column-target-wrap" class="editableRowTargetSelector"><section class="row-design-item  padded-design-item col-container" style="background-color: rgba(255, 255, 255, 0);;"><div class="four-col  taggable"></div><div class="four-col  taggable"></div><div class="four-col  taggable"></div><div class="four-col  taggable"></div></section></div></div>';
        }

        if(elementToCreate == 'two-thirds-col-right') {
            createdElementToAppend = '<div data-flow="sortable-wrappers" class="sortable-wrappers"><div data-flow="column-target-wrap" class="editableRowTargetSelector"><section class="row-design-item  padded-design-item col-container" style="background-color: rgba(255, 255, 255, 0);;"><div class="two-thirds-col  taggable"></div><div class="one-third-col  taggable"></div></section></div></div>';
        }

        if(elementToCreate == 'two-thirds-col-left') {
            createdElementToAppend = '<div data-flow="sortable-wrappers" class="sortable-wrappers"><div data-flow="column-target-wrap" class="editableRowTargetSelector"><section class="row-design-item  padded-design-item col-container" style="background-color: rgba(255, 255, 255, 0);;"><div class="one-third-col  taggable"></div><div class="two-thirds-col  taggable"></div></section></div></div>';
        }

        if(elementToCreate == 'heading') {
            if($("#designflowcollector h1").length) { //Check if h1 exists already.
                headingDomElement = "h2";
            } else if($("#designformflowcollector h1").length) {
                headingDomElement = "h2";
            } else {
                headingDomElement = "h1";
            }
            createdElementToAppend = '<div data-flow="heading" class="heading-item-design-wrapper editableTargetSelector"><' + headingDomElement + ' class="heading-design-item  ' + headingDomElement + '">Heading</' + headingDomElement + '></div>';
        }

        if(elementToCreate == 'paragraph') {
            createdElementToAppend = '<div data-flow="paragraph" class="paragraph-item-design-wrapper editableTargetSelector"><p class="paragraph-design-item">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p></div>';
        }

        if(elementToCreate == 'list') {
            createdElementToAppend = '<div data-flow="list" class="list-item-design-wrapper editableTargetSelector list-target-additional"><ul class="unorderlist-design-item"><li data-sub-target="list1">List Item</li></ul></div>';
        }

        if(elementToCreate == 'anchor') {
            createdElementToAppend = '<div data-flow="anchor" class="anchor-item-design-wrapper editableTargetSelector"><a href="#" class="anchor-design-item">Anchor Link</a></div>';
        }

        if(elementToCreate == 'image') {
            createdElementToAppend = '<div data-flow="image" class="image-item-design-wrapper editableTargetSelector image-item-additional"><figure class="image-item-wrapper"><img src="" style="max-width:1200px"></figure></div>';
        }
        
        if(elementToCreate == 'form') {
            createdElementToAppend = '<div data-flow="form" class="image-item-design-wrapper editableTargetSelector image-item-additional"><div data-flow="form-target" id="formTargetLazyLoad"></div></div>';
        }

        if(elementToCreate == 'reviews') {
            createdElementToAppend = '<div data-flow="reviews" class="image-item-design-wrapper editableTargetSelector image-item-additional"><div data-flow="reviews-target" id="reviewsTargetLazyLoad" data-manipulatereviewbgcolor="#00000070" data-manipulatereviewtextcolor="#ffffff" data-manipulatereviewnamecolor="#ffffff"></div></div>';
        }

        if(elementToCreate == 'video') {
            createdElementToAppend = '<div data-flow="video" class="image-item-design-wrapper editableTargetSelector image-item-additional"><figure class="video-item-wrapper"><video controls><source src="" type="video/mp4"> Your browser does not support the video tag.</video></div>';
        }

        //Todo, add + buttons to collumn divs to add items directly to boxes
        if(elementHas !== "column") {
            var emptyTagable = '<div data-flow="sortable-wrappers" class="sortable-wrappers"><div data-flow="column-target-wrap" class="editableRowTargetSelector"><section class="row-design-item  padded-design-item taggable" style="background-color: rgba(255, 255, 255, 0);;">' + createdElementToAppend + '</section></div></div>';
            if($('.taggable').length > 0) { //check if .taggable class (column sections only have this tag) exists
                if($('.taggable:empty').length) { //check to see if any are actually empty
                    $('.taggable:empty:first').append(createdElementToAppend); //append selected item to the first empty
                } else {
                    $('#designflowcollector').append(emptyTagable);
                }
            } else {
                $('#designflowcollector').append(emptyTagable);
            }
        } else {
            $('#designflowcollector').append(createdElementToAppend);
        }
    });

    var target = $("#formtarget")[0];

    var observer = new MutationObserver(function( mutations ) {
        mutations.forEach(function( mutation ) {
            var newNodes = mutation.addedNodes; // DOM NodeList
            if(newNodes !== null) { // If there are new nodes added
                sortableCall();
            }
        });    
     });

    var config = { 
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
    };

    //droptrue sortable-items-wrapper ui-sortable targeted to tagable class to move content
    if($("#formtarget").length > 0) {
        observer.observe(target, config);
    }

});