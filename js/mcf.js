$(function () {

    $('.options input').button();


    $('.options label').on('click', function () {

        $('.current .pads .pad')
            .removeClass('highlight')
            .find('.interval').html('');

        var key = $('fieldset#key label.ui-state-active').data('key');
        var intervals = $('fieldset#type label.ui-state-active').data('intervals');

        if (null === key || undefined === key || null === intervals || undefined === intervals) {
            return;
        }

        var root = Note.fromLatin(key);
        var chord = root.add(intervals);

        $(chord).each(function (key) {

            var interval_class = intervals[key].replace(" ", '-');
            var interval = intervals[key].replace('unison', 'root');

            $('.current .pads .pad[data-key="' + this.latin() + '"], .current .pads .pad[data-key-2="' + this.latin() + '"]')
                .addClass('highlight')
                .attr('data-interval', interval_class)
                .find('.interval').html(this.latin() + ' - ' + interval);
        });

    });

    $('a#add').on('click', function (e) {
        e.preventDefault();

        var name = $('fieldset#key label.ui-state-active .ui-button-text').html()
        name += ' ' + $('fieldset#type label.ui-state-active .ui-button-text').html();

        var nameLabel = $('<div/>')
            .addClass('name')
            .html(name);

        var remove = $('<a/>')
            .addClass('remove')
            .attr('href', '#')
            .html('x');

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
        })
    });

    //remove chord from collection
    $('.collection').delegate('.pads .remove', 'click', function (e) {
        e.preventDefault();
        ($(this).parent().fadeOut(function () {
            $(this).remove();
            refreshHash();
        }));
    });

    //activate first chord on load
    $('.options fieldset#key label').first().click();
    $('.options fieldset#type label').first().click();

    //load collection from URL
    try {
        var toLoad = JSON.parse(decodeURIComponent(location.hash.substring('1')));

        $(toLoad).each(function () {
            var chord = this.split('_');

            $('.options #key label').filter(function () {
                if ($(this).text() == chord[0]) {
                    this.click();
                }
            });

            $('.options #type label').filter(function () {
                if ($(this).text() == chord[1]) {
                    this.click();
                }
            });

            $('a#add').click();

        });

    }
    catch (e) {
    }

    //store collection in URL hash
    function refreshHash() {
        var collection = [];
        $('.collection .pads').each(function () {
            var name = $(this).find('.name').html().replace(' ', '_');
            collection.push(name);
        });

        location.hash = JSON.stringify(collection);
    }
});