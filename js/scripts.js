$(document).ready(function () {

    "use strict";

    // Detect logo dimensions and add correct class

    var logoImage = $('.top-bar .logo:first-of-type');

    var theImage = new Image();
    theImage.src = logoImage.attr("src");

    var logoWidth = theImage.width;
    var logoHeight = theImage.height;
    var logoRatio = logoWidth / logoHeight;

    if (logoRatio > 2.8) {
        $('.top-bar .logo').addClass('logo-wide');
    }

    if (logoRatio < 2) {
        $('.top-bar .logo').addClass('logo-square');
    }

    // Smooth scroll

    $('.inner-link').smoothScroll({offset: 0, speed: 800});

    // Mobile Toggle

    $('.mobile-toggle').click(function () {
        $('nav').toggleClass('open-nav');
    });


    $('.fullscreen-element').each(function () {
        $(this).css('height', $(window).height());
    });


    // Scroll Reveal

    if (!(/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)) {
        window.scrollReveal = new scrollReveal();
    } else {
        $('body').addClass('pointer');
    }

    // Feature Selector

    $('.selector-tabs li').click(function () {
        $(this).parent('.selector-tabs').children('li').removeClass('active');
        $(this).addClass('active');

        var activeTab = $(this).index() + 1;

        $(this).closest('.feature-selector').find('.selector-content').children('li').removeClass('active');
        $(this).closest('.feature-selector').find('.selector-content').children('li:nth-child(' + activeTab + ')').addClass('active');
    });

    // Append .background-image-holder <img>'s as CSS backgrounds

    $('.background-image-holder').each(function () {
        var imgSrc = $(this).children('img').attr('src');
        $(this).css('background', 'url("' + imgSrc + '")');
        $(this).children('img').hide();
        $(this).css('background-position', '50% 0%');
    });

    /************** Parallax Scripts **************/

    var isFirefox = typeof InstallTrigger !== 'undefined';
    var isIE = /*@cc_on!@*/ false || !!document.documentMode;
    var isChrome = !!window.chrome;
    var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    var prefix;

    if (isFirefox) {
        prefix = '-moz-';
    } else if (isIE) {

    } else if (isChrome || isSafari) {
        prefix = '-webkit-';
    }

    $('.main-container section:first-child').addClass('first-child');

    $('.parallax-background').each(function () {

        if ($(this).closest('section').hasClass('first-child') && !$(this).closest('section').hasClass('slider-fullscreen')) {
            $(this).attr('data-top', prefix + 'transform: translate3d(0px,0px, 0px)');
            $(this).attr('data-top-bottom', prefix + 'transform: translate3d(0px,200px, 0px)');

        } else {
            $(this).attr('data-bottom-top', prefix + 'transform: translate3d(0px,-100px, 0px)');
            $(this).attr('data-center', prefix + 'transform: translate3d(0px,0px, 0px)');
            $(this).attr('data-top-bottom', prefix + 'transform: translate3d(0px,100px, 0px)');
        }
    });

    if (!(/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)) {
        skrollr.init({
            forceHeight: false
        });

        // Multi Layer Parallax

        $('.hover-background').each(function () {
            $(this).mousemove(function (event) {
                $(this).find('.background-image-holder').css('transform', 'translate(' + -event.pageX / 30 + 'px,' + -event.pageY / 45 + 'px)');
                $(this).find('.layer-1').css('transform', 'translate(' + -event.pageX / 50 + 'px,' + -event.pageY / 50 + 'px)');
                $(this).find('.layer-2').css('transform', 'translate(' + -event.pageX / 60 + 'px,' + -event.pageY / 60 + 'px)');
            });
        });
    }

});


$(function () {
    var mediumPromise = new Promise(function (resolve) {
        var $content = $('#jsonContent');
        var data = {
            rss: 'https://medium.com/feed/@medium'
        };
        $.get(' https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40medium', data, function (response) {
            if (response.status == 'ok') {
                $("#logo").append(`<img src="${response.feed["image"]}" class="rounded mx-auto d-block">`);
                var display = '';
                $.each(response.items, function (k, item) {
                    display += `<div class="col-sm-3 "><div class="blog-item">`;
                    var src = item["thumbnail"];
                    display += `<img src="${src}" class="card-img-top" alt="Cover image">`;
                    display += `<div class="card-body">`;
                    display += `<h5 class="card-title"><a href="${item.link}">${item.title}</a></h5>`;
                    var yourString = item.description.replace(/<img[^>]*>/g, "");
                    yourString = yourString.replace('h4', 'p');
                    yourString = yourString.replace('h3', 'p');
                    var maxLength = 300;
                    var trimmedString = yourString.substr(0, maxLength);
                    trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")));
                    display += `<p class="card-text">${trimmedString}...</p>`;

                    display += `<a href="${item.link}" target="_blank" class="btn btn-primary btn-filled btn-xs" >Read More</a>`;
                    display += '</div></div></div>';
                    return k < 3;
                });

                resolve($content.html(display));
            }
        });
    });

    mediumPromise.then(function () {

        pageSize = 4;
        var pageCount = $(".card").length / pageSize;
        for (var i = 0; i < pageCount; i++) {
            $("#pagin").append(`<li class="page-item"><a class="page-link" href="#">${(i + 1)}</a></li> `);
        }
        $("#pagin li:nth-child(1)").addClass("active");
        showPage = function (page) {
            $(".card").hide();
            $(".card").each(function (n) {
                if (n >= pageSize * (page - 1) && n < pageSize * page)
                    $(this).show();
            });
        };

        showPage(1);

        $("#pagin li").click(function () {
            $("#pagin li").removeClass("active");
            $(this).addClass("active");
            showPage(parseInt($(this).text()));
            return false;
        });
    });
});