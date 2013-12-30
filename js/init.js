var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-38888541-2']);
_gaq.push(['_trackPageview']);

(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

/**
 * init joyride on window load ...
 */
$(window).load(function () {

    var fadeSpeed = 1500;

    $('#joyRideTipContent').joyride({
        tipAnimation: 'fade',
        cookieMonster: false,
        autoStart: true,
        nextButton: false,
        preStepCallback: function (index, tip) {
            switch (index) {
                case 2:
                    $('#key button').on('click.tour', function () {
                        tip.find('.joyride-next-tip').click();
                    });
                    break;
                case 3:
                    $('#type button').on('click.tour', function () {
                        tip.find('.joyride-next-tip').click();
                    });
                    break;
                case 5:
                    $('#add').on('click.tour', function () {
                        tip.find('.joyride-next-tip').click();
                    });
                    break;
            }
        },
        postStepCallback: function (index) {
            switch (index) {
                case 2:
                    $('#key button').off('click.tour');
                    break;
                case 3:
                    $('#type button').off('click.tour');
                    break;
                case 5:
                    $('#add').off('click.tour');
                    if (0 == $('.collection .pads').length) {
                        $('button#add').click();
                    }
                    break;
            }
        },
        modal: false,
        expose: true
    });

    $('a.tour-close').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).parent().find('.joyride-close-tip').click();
    });

});

$(function(){
    $(document)
        .foundation()
        .foundation('reveal', {closeOnBackgroundClick: true});

    $.urlShortener.settings.apiKey = 'AIzaSyDbzzXiRyDKWmf6AXCkhUHy7B0NTJ46J54';

    //display chord
    $('.options #key button, .options #type button').on('click', function () {

        $(this).parent().parent().find('button').removeClass('active');
        $(this).addClass('active');

        var key = $('div#key button.active').data('key');
        var intervals = $('div#type button.active').data('intervals');

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
    });

    //clear collection
    $('button#clear').on('click', function (e) {
        e.preventDefault();
        $('.collection .pads .remove').each(function () {
            $(this).click();
        });
    });

    //remove chord from collection
    $('.collection').delegate('.pads .remove', 'click', function (e) {
        e.preventDefault();
        ($(this).parent().fadeOut(function () {
            $(this).remove();
        }));
    });

    //layout switch
    $('#layout button').on('click', function () {
        $('#layout button').removeClass('active');
        $(this).addClass('active');
        MPCCF.activateLayout($(this).data('layout'));
        MPCCF.load(false);
    });

    $('button#print').on('click', function(){
        try {
            _gaq.push(['_trackEvent', 'print']);
        } catch (err) {
        }
    });

    //share
    $('button#share').on('click', function () {

        $('a.tour-close').trigger('click');

        $.urlShortener({
            longUrl: MPCCF.save(),
            success: function (shortUrl) {

                try {
                    _gaq.push(['_trackEvent', 'share', shortUrl ]);
                } catch (err) {
                }

                $('#share-dialog').find('input').val(shortUrl);

                var fbLink = $('#share-dialog a.fb').data('href');
                fbLink += "?u=" + encodeURIComponent(shortUrl);
                fbLink += "&t=" + encodeURIComponent("check out these awesome mpc chords");
                $('#share-dialog a.fb').attr('href', fbLink);

                var twitterLink = $('#share-dialog a.twitter').data('href');
                twitterLink += "?url=" + encodeURIComponent(shortUrl);
                twitterLink += "&text=" + encodeURIComponent("check out awesome set of chords for akai #mpc");
                $('#share-dialog a.twitter').attr('href', twitterLink);

                var gPLusLink = $('#share-dialog a.g-plus').data('href');
                gPLusLink += "?url=" + encodeURIComponent(shortUrl);
                $('#share-dialog a.g-plus').attr('href', gPLusLink);


                $("#share-dialog").foundation('reveal', 'open');

            },
            error: function (err) {
//                alert(JSON.stringify(err));
            }
        });
    });

    //close dialog
    $('.close-reveal-modal').on('click', function () {
        $('#share').foundation('reveal', 'close');
    });

    //initially load collection data
    MPCCF.load(true);
    //(re)activate current layout
    MPCCF.activateLayout($('#layout button.active').data('layout'))

    //activate first chord on load
    $('.options div#key button.active').click();
});