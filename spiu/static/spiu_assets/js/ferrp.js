
// jQuery to collapse the navbar on scroll
$(window).scroll(function () {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});
//
// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function () {
    $('a.page-scroll').bind('click', function (event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 64)
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});
//
// // Highlight the top nav as scrolling occurs
// $('body').scrollspy({
//     target: '.navbar-fixed-top',
//     offset: 65
// })
//
// // Closes the Responsive Menu on Menu Item Click
// $('.navbar-collapse ul li a').click(function () {
//     $('.navbar-toggle:visible').click();
// });
//
// // Countdown
$('#clock').countdown('2016/10/31').on('update.countdown', function (event) {
    var $this = $(this).html(event.strftime(''
        + '<div><span>%-w</span>week%!w</div>'
        + '<div><span>%-d</span>day%!d</div>'
        + '<div><span>%H</span>hr</div>'
        + '<div><span>%M</span>min</div>'
        + '<div><span>%S</span>sec</div>'));
});


(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
//
ga('create', 'UA-1057679-2', 'auto');
ga('send', 'pageview');
