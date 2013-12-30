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

        location.hash = '';

    }
    catch (e) {
    }
}

//store data in URL hash
MPCCF.save = function () {
    var data = {};
    data['layout'] = $('#layout button.active').data('layout');
    data['collection'] = [];
    $('.collection .pads').each(function () {
        var name = $(this).find('.name').html().replace(' ', '_');
        data['collection'].push(name);
    });

    var a = document.createElement('a');
    a.href = location.href;
    a.hash = encodeURIComponent($.base64.encode(JSON.stringify(data)));

    return a.href;
}

//activate Layout
MPCCF.activateLayout = function (layout) {
    $('.current .pads')
        .removeClass('pads12')
        .removeClass('pads16')
        .addClass(layout);
    $('.current .pads').html($('template#' + layout).html());
    $('.options div#key button.active').click();
}

MPCCF.addCurrentChordToCollection = function () {
    var name = $('div#key button.active').text()
    name += ' ' + $('div#type button.active').text();

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