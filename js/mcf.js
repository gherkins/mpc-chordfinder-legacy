var ctx = new webkitAudioContext()
    , osc = []
    , octave = 3;

$(function () {

    $('.options select').on('change', function () {

        $('.current .pads .pad')
            .removeClass('highlight')
            .find('.interval').html('');

        var key = $('.options select#key').val();
        var intervals = $('.options select#type option:selected').data('intervals');

        if (null === key || null == intervals) {
            return;
        }

        key += octave;
        var root = Note.fromLatin(key);

        var chord = root.add(intervals);

        $(chord).each(function (key) {

            var interval_class = intervals[key].replace(" ", '-');
            var interval = intervals[key].replace('unison', 'root');

            $('.current .pads .pad[data-key="' + this.latin() + '"], .current .pads .pad[data-key-2="' + this.latin() + '"]')
                .addClass('highlight')
                .attr('data-interval', interval_class)
                .find('.interval').html(this.latin() + ' - ' + interval);

            console.log(this.latin());
        });

    });

    $('a#add').on('click', function (e) {
        e.preventDefault();

        var name = $('.options select#key').val();
        name += ' ' + $('.options select#type option:selected').html();

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
    });

    $('.collection').delegate('.pads .remove', 'click', function (e) {
        e.preventDefault();
        ($(this).parent().fadeOut(function () {
            $(this).remove();
        }));
    })
});