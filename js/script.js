var $doc, $header, $body;

$(function ($) {

    $body = $('body');
    $header = $('.header');

    $('.catOpen').on('click', function () {
        var firedEl = $(this);

        firedEl.closest('.prodCat').toggleClass('opened').find('.catList').slideToggle(600);

        return false;
    });

    $('.menuBtn').on('click', function () {
        $body.toggleClass('menu_opened');

        return false;
    });

    $('.prodRow').on('click', function (e) {
        var firedEl = $(this);

        if (!(e.target.tagName == 'INPUT'
            || e.target.tagName == 'LABEL'
            || $(e.target).closest('LABEL').length)) {

            firedEl.find('.prodCheck').prop('checked', 'checked');

        }
    });

    $('.sortBtn').on('click', function () {
        var firedEl = $(this), col = firedEl.closest('.sortCol');

        if (col.hasClass('_sort_asc') || col.hasClass('_sort_desc')) {
            col.toggleClass('_sort_asc').toggleClass('_sort_desc');
        } else {
            col.addClass('_sort_desc');
        }

        col.siblings().removeClass('_sort_asc').removeClass('_sort_desc');

        return false;
    });

});

