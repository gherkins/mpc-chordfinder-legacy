var ctx = new webkitAudioContext()
    , osc = []
    , octave = 5

$(function () {

    $('.options select').on('change', function () {

        $('.pads .pad')
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

            $('.pads .pad[data-key="' + this.latin() + '"], .pads .pad[data-key-2="' + this.latin() + '"]')
                .addClass('highlight')
                .attr('data-interval', interval_class)
                .find('.interval').html(this.latin() + ' - ' + interval);

            console.log(this.latin());
        });

        //create oscillators and play sound
//        $(chord).each(function (key) {
//            var time = ctx.currentTime;
//            osc[key] = ctx.createOscillator();
//            osc[key].type = 0;
//            osc[key].connect(ctx.destination);
//            osc[key].frequency.value = this.frequency().toFixed(2);
//            osc[key].start(time);
//            osc[key].stop(time + 1);
//        });

    });
});