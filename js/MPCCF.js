function MPCCF() {
};

MPCCF.load = function (withLayout) {
    //load data from URL
    try {
        var data = JSON.parse($.base64.decode(decodeURIComponent(location.hash.substring('1'))));

        if (true === withLayout) {
            //apply layout
            MPCCF.activateLayout(data.layout);
            $('#layout button').removeClass('active');
            $('#layout button[data-layout="' + data.layout + '"]').addClass('active');
        }

        $('.collection .pads').remove();
        //load collection from URL data
        $(data.collection).each(function () {
            var chord = this.split('_');

            //set key
            $('.options #key button').filter(function () {
                if ($(this).text() == chord[0]) {
                    this.click();
                }
            });

            //set type
            $('.options #type button').filter(function () {
                if ($(this).text() == chord[1]) {
                    this.click();
                }
            });

            //add the chord
            MPCCF.addCurrentChordToCollection();

        });

        //refresh hash
        MPCCF.refreshHash();

    }
    catch (e) {
    }
}

//store data in URL hash
MPCCF.refreshHash = function refreshHash() {
    var data = {};
    data['layout'] = $('#layout button.active').data('layout');
    data['collection'] = [];
    $('.collection .pads').each(function () {
        var name = $(this).find('.name').html().replace(' ', '_');
        data['collection'].push(name);
    });

    location.hash = encodeURIComponent($.base64.encode(JSON.stringify(data)));
}

//activate Layout
MPCCF.activateLayout = function (layout) {
    $('.current .pads')
        .removeClass('pads12')
        .removeClass('pads16')
        .addClass(layout);
    $('.current .pads').html($('template#' + layout).html());
    $('.options fieldset#key button.active').click();
}

MPCCF.addCurrentChordToCollection = function () {
    var name = $('fieldset#key button.active').text()
    name += ' ' + $('fieldset#type button.active').text();

    //chord name
    var nameLabel = $('<div/>')
        .addClass('name')
        .html(name);

    //remove link
    var remove = $('<a/>')
        .addClass('remove')
        .attr('href', '#')
        .html('X');

    //clone pads and append to collection
    $('.current .pads')
        .clone()
        .prepend(remove)
        .prepend(nameLabel)
        .appendTo('.collection')
        .find('.interval').remove();

    $('.collection').find('.clear').appendTo('.collection');
}

$(function () {

    $('.options #key button, .options #type button').on('click', function () {

        $(this).parent().find('button').removeClass('active');
        $(this).addClass('active');

        var key = $('fieldset#key button.active').data('key');
        var intervals = $('fieldset#type button.active').data('intervals');

        if (null === key || undefined === key || null === intervals || undefined === intervals) {
            return;
        }

        $('.current .pads .pad')
            .removeClass('highlight')
            .find('.interval').html('');

        //build chord
        var root = Note.fromLatin(key);
        var chord = root.add(intervals);

        $(chord).each(function (key) {
            //highlight PAD and add note- and interval name
            $('.current .pads .pad[data-key="' + this.latin() + '"], .current .pads .pad[data-key-2="' + this.latin() + '"]')
                .addClass('highlight');
        });

    });

    //add chord to collection
    $('button#add').on('click', function (e) {
        e.preventDefault();

        MPCCF.addCurrentChordToCollection();

        MPCCF.refreshHash();

    });

    //clear collection
    $('button#clear').on('click', function (e) {
        e.preventDefault();
        $('.collection .pads .remove').each(function () {
            $(this).click();
        });
        MPCCF.refreshHash();
    });

    //remove chord from collection
    $('.collection').delegate('.pads .remove', 'click', function (e) {
        e.preventDefault();
        ($(this).parent().fadeOut(function () {
            $(this).remove();
            MPCCF.refreshHash();
        }));
    });

    //layout switch
    $('#layout button').on('click', function () {
        $('#layout button').removeClass('active');
        $(this).addClass('active');
        MPCCF.activateLayout($(this).data('layout'));
        MPCCF.refreshHash();
        MPCCF.load(false);
    });

    //initially load collection data
    MPCCF.load(true);
    //(re)activate current layout
    MPCCF.activateLayout($('#layout button.active').data('layout'))

    //activate first chord on load
    $('.options fieldset#key button.active').click();
});