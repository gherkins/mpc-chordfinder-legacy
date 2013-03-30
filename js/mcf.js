var intervalShortnames = {
    'unison': '1',
    'minor second': 'b2',
    'major second': '2',
    'minor third': 'b3',
    'major third': '3',
    'fourth': '4',
    'augmented fourth': '#4',
    'tritone': 'b5',
    'diminished fifth': 'b5',
    'fifth': '5',
    'minor sixth': 'b6',
    'major sixth': '6',
    'minor seventh': 'b7',
    'major seventh': '7',
    'octave': '1'
};

$(function () {

    $('.options input').button();

    //
    $('.options #key label, .options #type label').on('click', function () {

        var key = $('fieldset#key label.ui-state-active').data('key');
        var intervals = $('fieldset#type label.ui-state-active').data('intervals');

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

            //shortname for on-pad display
            var intervalShortname = intervalShortnames[intervals[key]];

            //highlight PAD and add note- and interval name
            $('.current .pads .pad[data-key="' + this.latin() + '"], .current .pads .pad[data-key-2="' + this.latin() + '"]')
                .addClass('highlight')
                .find('.interval').html(intervalShortname + ':' + this.latin());
        });

    });

    //add chord to collection
    $('a#add').on('click', function (e) {
        e.preventDefault();

        var name = $('fieldset#key label.ui-state-active .ui-button-text').html()
        name += ' ' + $('fieldset#type label.ui-state-active .ui-button-text').html();

        //chord name
        var nameLabel = $('<div/>')
            .addClass('name')
            .html(name);

        //remove link
        var remove = $('<a/>')
            .addClass('remove')
            .attr('href', '#')
            .html('x');

        //clone pads and append to collection
        $('.current .pads')
            .clone()
            .prepend(remove)
            .prepend(nameLabel)
            .appendTo('.collection')
            .find('.interval').remove();

        refreshHash();

    });

    //clear collection
    $('a#clear').on('click', function (e) {
        e.preventDefault();
        $('.collection .pads .remove').each(function () {
            $(this).click();
        });
        refreshHash();
    });

    //remove chord from collection
    $('.collection').delegate('.pads .remove', 'click', function (e) {
        e.preventDefault();
        ($(this).parent().fadeOut(function () {
            $(this).remove();
            refreshHash();
        }));
    });

    //layout switch
    $('.options #layout label').on('click', function () {
        var layout = $(this).data('layout');
        $('.current .pads')
            .removeClass('pads12')
            .removeClass('pads16')
            .addClass(layout);
        $('.current .pads').html($('template#' + layout).html());
        $('.options fieldset#key label.ui-state-active').click();
        refreshHash();
    });

    //load collection from URL
    try {
        var data = JSON.parse(decodeURIComponent(location.hash.substring('1')));

        //apply layout
        $('.options #layout label[data-layout="' + data.layout + '"]').click();

        //load collection from URL data
        $(data.collection).each(function () {
            var chord = this.split('_');

            //set key
            $('.options #key label').filter(function () {
                if ($(this).text() == chord[0]) {
                    this.click();
                }
            });

            //set type
            $('.options #type label').filter(function () {
                if ($(this).text() == chord[1]) {
                    this.click();
                }
            });

            //add the chord
            $('a#add').click();

        });

    }
    catch (e) {
    }

    //(re)activate current layout
    $('.options #layout label.ui-state-active').click();


    //activate first chord on load
    $('.options fieldset#key label.ui-state-active').click();

    //store data in URL hash
    function refreshHash() {
        var data = {};
        data['layout'] = $('.options #layout label.ui-state-active').data('layout');
        data['collection'] = [];
        $('.collection .pads').each(function () {
            var name = $(this).find('.name').html().replace(' ', '_');
            data['collection'].push(name);
        });

        location.hash = JSON.stringify(data);
    }
});