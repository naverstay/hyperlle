var $doc, $header, $body, $order_form, $order_form_2, $click2OrderPoint, $click2Order, servers_data, current_servers, sort_asc = false, sort_param;

$(function ($) {

    $doc = $(document);
    $body = $('body');
    $header = $('.header');
    $click2Order = $('.click2Order');
    $click2OrderPoint = $('.click2OrderPoint');

    sort_param = $('.sortLoad').attr('data-sort-param');

    $('.valMinus').on('click', function () {
        var valCell = $(this).closest('.valCell'),
            inp = valCell.find('input'),
            val = parseInt(inp.val()),
            min_val = 1 * inp.attr('data-min'),
            new_val = val - (1 * inp.attr('data-step'));

        inp.val(new_val >= min_val ? new_val : min_val);

        return false;
    });

    $('.valPlus').on('click', function () {
        var valCell = $(this).closest('.valCell'),
            inp = valCell.find('input'),
            val = parseInt(inp.val()),
            max_val = 1 * inp.attr('data-max'),
            new_val = val + (1 * inp.attr('data-step'));

        inp.val(new_val <= max_val ? new_val : max_val);

        return false;
    });

    $body
        .delegate('.cardCounter', 'blur', function (e) {
            var firedEl = $(this);

            if (firedEl.val() * 1 < 1) {
                firedEl.val(1);
            }
        })
        .delegate('.catOpen', 'click', function (e) {
            var firedEl = $(this);

            firedEl.closest('.prodCat').toggleClass('opened').find('.catList').slideToggle(600);

            return false;
        })
        .delegate('.menuBtn', 'click', function (e) {
            $body.toggleClass('menu_opened');

            return false;
        })
        .delegate('.orderPromo', 'click', function (e) {
            var firedEl = $(this), unit = firedEl.closest('.unit_inner');

            $('.orderInfo').val(unit.find('.offer_cpu').text() + unit.find('.offer_gpu').text());
            $('.orderDays').val(1);

            $('.orderCount').val(1);

            $order_form_2.dialog('open');

            return false;
        })
        .delegate('.prodCheck', 'change', function (e) {
            var firedEl = $(this);

            $('.orderSettings').show();

            if (firedEl.closest('.prodRow').attr('data-card')) {
                $('.partCondition').show();
            } else {
                $('.partCondition').hide();
                $('#card_counter').val(1);
            }

            setTimeout(function () {
                $('.orderPrice').text(firedEl.attr('data-price'));

                $('.orderInfo').val(firedEl.attr('data-name') + ' ' + firedEl.attr('data-options'));
            }, 1);

        })
        .delegate('.prodRow', 'click', function (e) {
            var firedEl = $(this);

            if (!(e.target.tagName == 'INPUT'
                || e.target.tagName == 'LABEL'
                || $(e.target).closest('LABEL').length)) {

                firedEl.find('.prodCheck').prop('checked', 'checked').trigger('change');

            }
        })
        .delegate('.sortBtn', 'click', function (e) {
            var firedEl = $(this), col = firedEl.closest('.sortCol'), way = firedEl.attr('data-sort');

            if (way == 'asc') {
                firedEl.attr('data-sort', 'desc');
                sort_asc = false;
            } else {
                firedEl.attr('data-sort', 'asc');
                sort_asc = true;
            }

            if (col.hasClass('_sort_asc') || col.hasClass('_sort_desc')) {
                col.toggleClass('_sort_asc').toggleClass('_sort_desc');
            } else {
                col.addClass('_sort_desc');
                firedEl.attr('data-sort', 'desc');
                sort_asc = false;
            }

            sort_param = firedEl.attr('data-sort-param');

            col.siblings().removeClass('_sort_asc').removeClass('_sort_desc');

            reloadItems(current_servers.sort(sort_items));

            return false;
        });

    $("input").each(function (i, el) {
        var inp = $(this);
        if (inp.attr('data-inputmask-regex') != void 0) {
            inp.inputmask('Regex');
        }
    });

    var tabBlock = $('.tabBlock'),
        study_tabs = tabBlock.tabs({
            active: 0,
            tabContext: tabBlock.data('tab-context'),
            activate: function (e, ui) {
                $('.tabColone li').eq($(ui.newTab).index()).show().siblings().hide();
            }
        });

    if ($("#order_form").length) {

        $order_form = $("#order_form").dialog({
            autoOpen: false,
            modal: true,
            closeOnEscape: true,
            closeText: '',
            show: "fade",
            position: {my: "center center", at: "center center", of: window},
            draggable: true,
            dialogClass: 'dialog_global dialog_g_size_1 dialog_close_butt_mod_1 title_center_mod dialog_butt_v1',
            width: 840,
            open: function (event, ui) {
                $body.addClass('dialog_regular_open');
            },
            close: function (event, ui) {
                $body.removeClass('dialog_regular_open');
            }
        });
    }

    $('.orderOpenBtn').on('click', function () {
        copyData();

        $order_form.dialog('open');

        return false;
    });

    if ($("#order_form_2").length) {

        $order_form_2 = $("#order_form_2").dialog({
            autoOpen: false,
            modal: true,
            closeOnEscape: true,
            closeText: '',
            show: "fade",
            position: {my: "center center", at: "center center", of: window},
            draggable: true,
            dialogClass: 'dialog_global dialog_g_size_1 dialog_close_butt_mod_1 title_center_mod dialog_butt_v1',
            width: 840,
            open: function (event, ui) {
                $body.addClass('dialog_regular_open');
            },
            close: function (event, ui) {
                $body.removeClass('dialog_regular_open');
            }
        });
    }

    $('.orderOpenBtn2').on('click', function () {
        copyData();

        $order_form_2.dialog('open');

        return false;
    });

    $('.sendMailForm').each(function (ind) {
        var form = $(this);

        form.on('submit', function () {
            var str = form.serialize();

            $.ajax({
                type: "POST",
                url: 'contact.php',
                data: str,
                success: function (msg) {
                    if (msg == 'OK') {
                        result = '<div class="notification_ok">Спасибо, Ваша заявка была отправлена</div>';
                    } else {
                        result = msg;
                    }
                    form.find('.serverAnswer').html(result).fadeIn().delay(2000).fadeOut("slow");
                }
            });
            return false;
        });
    });

    initFilter();

    all_dialog_close();

    $(window).on('scroll', function () {
        $click2Order.toggleClass('_fixed_order', $doc.scrollTop() + $header.outerHeight() >= $click2OrderPoint.offset().top);
    });
});

function all_dialog_close() {
    $body.on('click', '.ui-widget-overlay', all_dialog_close_gl);
}

function all_dialog_close_gl() {
    $(".ui-dialog-content").each(function () {
        var $this = $(this);
        if (!$this.parent().hasClass('always_open')) {
            $this.dialog("close");
        }
    });
}

function copyData() {
    $('.orderDays').val($('#days_counter').val());

    $('.orderCount').val($('#card_counter').val());
}

function initFilter() {
    var applyFilter = $('.applyFilter'),
        applyPrice = $('.applyPrice'),
        applyPart = $('.applyPart');

    $.getJSON("data/hyperlee.json", function (data) {
        servers_data = data.sort(sort_items);

        startFilter();

        applyFilter.on('change', function () {
            startFilter();
        });

        applyPrice.on('change', function () {
            startFilter();
        });

        applyPart.on('change', function () {
            startFilter();
        });
    });
}

function startFilter() {
    var has_filters = false,
        filter_list = [
            'dedicated_server',
            'virtual_server',

            'hosting_server',
            'office_server',
            'machine_study',
            'graphics_work',
            'rendering',
            'games',
            'storage',
            'other'
        ],
        arr = [],
        checked_filters = [],
        price_filters = [];

    var filtered = [];

    $('.applyFilter:checked').each(function (i) {
        var filter = $(this),
            filter_name = filter.attr('data-filter');

        has_filters = true;

        if ('checkbox' === this.type) {

            filtered = $.map(servers_data, function (el, index) {
                if (el.hasOwnProperty(filter_name) === true) {
                    var param = el[filter_name];
                    if ((param * 1)) {
                        return el;
                    }
                }
            });

            if (filtered.length) {
                for (var j = 0; j < filtered.length; j++) {
                    arr.push(filtered[j])
                }
            }
        }
    });

    current_servers = has_filters ? arrayUnique(arr) : servers_data;

    $('.applyPart:checked').each(function (i) {
        var filter = $(this),
            filter_name = filter.attr('data-filter');

        has_filters = true;

        if (!i) arr = [];

        if ('checkbox' === this.type) {
            var part_name = filter.attr('data-filter-part');

            filtered = $.map(current_servers, function (el, index) {
                if (el.hasOwnProperty(filter_name) === true) {
                    var param = el[filter_name];
                    if (param == part_name) {
                        return el;
                    }
                }
            });

            if (filtered.length) {
                for (var j = 0; j < filtered.length; j++) {
                    arr.push(filtered[j])
                }
            }
        }
    });

    current_servers = has_filters ? arrayUnique(arr) : servers_data;

    $('.applyPrice:checked').each(function (i) {
        var filter = $(this),
            filter_name = filter.attr('data-filter');

        has_filters = true;

        if (!i) arr = [];

        if ('checkbox' === this.type) {
            var min_price = 1 * filter.attr('data-filter-min'),
                max_price = 1 * filter.attr('data-filter-max');

            filtered = $.map(current_servers, function (el, index) {
                if (el.hasOwnProperty(filter_name) === true) {
                    var param = el[filter_name];

                    if (param * 1 >= min_price && param * 1 < max_price) {
                        return el;
                    }
                }
            });

            if (filtered.length) {
                for (var j = 0; j < filtered.length; j++) {
                    arr.push(filtered[j])
                }
            }
        }
    });

    current_servers = arrayUnique(arr);

    reloadItems(has_filters ? current_servers.sort(sort_items) : servers_data);

}

function sort_items(a, b) {
    if (sort_asc) {
        return a.price_day - b.price_day;
    } else {
        return b.price_day - a.price_day;
    }
}

function reloadItems(arr) {
    var html = '';

    $('.partCondition').hide();

    $('.orderSettings').hide();

    if (arr.length) {
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i],
                name = (item.tariff_name).replace(/(Hyperl[e]{1,2})(.*)/ig, '$1'),
                suffix = (item.tariff_name).replace(/(Hyperl[e]{1,2}(.*))/ig, '$2'),
                options =
                    addItem(item.cpu) +
                    addItem(item.ram) +
                    addItem(item.hdd) +
                    addItem(item.gpu);

            html +=
                '<div class="tr prodRow"' +
                (/X+[L]?/g.test(suffix) ? 'data-card="true"' : '' ) +
                '>' +
                '<div class="td _col_1">' +
                '<div class="prod_name">' +
                '<label class="radio_v1">' +
                '<input class="hide prodCheck" type="radio" name="product" data-price="' + addItem(item.price_day) + '" data-options="' + options +
                '" data-name="' + item.tariff_name +
                '" >' +
                '<span class="check_text"><span>' +
                name +
                '</span>' +
                '<span class="fw_b">' +
                suffix +
                '</span>' +
                '</span>' +
                '</label>' +
                '</div>' +
                '</div>' +
                '<div class="td _col_3">' +
                '<div class="prod_price">' +
                '<span>' +
                addItem(item.price_day) +
                '</span> ' +
                '<span class="_rub"> Г</span>' +
                '</div>' +
                '</div>' +
                '<div class="td _col_2">' +
                '<div class="prod_info">' +
                '<p>' +
                options +
                '</p>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
    } else {
        html = '<div class="subscribe_block">' +
            '<p>По вашему запросу ничего не найдено</p>' +
            '</div>';
    }

    $('.prodOffers').html(html);

}

function addItem(str) {
    return str + ' ' || '';
}

function arrayUnique(array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
}
