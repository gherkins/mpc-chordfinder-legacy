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

    $('button#share').on('click', function () {

        $('a.tour-close').trigger('click');

        $.urlShortener({
            longUrl: MPCCF.save(),
            success: function (shortUrl) {
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

    $('.close-reveal-modal').on('click', function () {
        $('#share').foundation('reveal', 'close');
    });
});