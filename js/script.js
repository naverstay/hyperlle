var $doc, $header, $body, servers_data, current_servers, sort_asc = false, sort_param, min_price, max_price;

$(function ($) {

    $body = $('body');
    $header = $('.header');

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
        .delegate('.prodRow', 'click', function (e) {
            var firedEl = $(this);

            if (!(e.target.tagName == 'INPUT'
                || e.target.tagName == 'LABEL'
                || $(e.target).closest('LABEL').length)) {

                firedEl.find('.prodCheck').prop('checked', 'checked');
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

            reloadItems(current_servers.sort(compare));

            return false;
        });

    $("input").each(function (i, el) {
        var inp = $(this);
        if (inp.attr('data-inputmask-regex') != void 0) {
            inp.inputmask('Regex');
        }
    });

    initFilter();

});

function initFilter() {
    var applyFilter = $('.applyFilter'),
        applyPrice = $('.applyPrice');

    $.getJSON("data/hyperlee.json", function (data) {
        servers_data = data;

        startFilter();

        applyFilter.on('change', function () {
            startFilter();
        });

        applyPrice.on('change', function () {
            startFilter();
        });
    });
}

function startFilter() {
    var filter_list = [
            'dedicated_server',
            'virtual_server',
            'office_server',
            'machine_study',
            'graphics_work',
            'rendering',
            'games',
            'storage',
            'other'
        ],
        arr = [],
        checked_filters = [];

    $('.prodCat').each(function (ind) {
        var filterGroup = $(this), filtered = [];

        filterGroup.find('.applyFilter').each(function (i) {
            var filter = $(this),
                filter_name = filter.attr('data-filter'),
                filter_val;

            if ('checkbox' === this.type) {
                filter_val = filter.is(':checked');

                if (filter_val) {
                    filtered = $.map(servers_data, function (el, index) {
                        if (el.hasOwnProperty(filter_name) === true) {
                            var param = el[filter_name];

                            // console.log(filter_val == (param * 1), filter_name, filter_val, param * 1);

                            if ('boolean' === typeof (filter_val)) {
                                // console.log(filter_name, filter_val == (param * 1));
                                if (filter_val == (param * 1)) {
                                    return el;
                                }
                            }
                        }
                    });
                }

                if (filtered.length) {
                    for (var j = 0; j < filtered.length; j++) {
                        arr.push(filtered[j])
                    }
                }
            }
        });

        filterGroup.find('.applyPrice').each(function (i) {
            var filter = $(this),
                filter_name = filter.attr('data-filter'),
                filter_val;

            if ('checkbox' === this.type) {
                filter_val = filter.is(':checked');

                if (filter_val) {
                    min_price = 1 * filter.attr('data-filter-min');
                    max_price = 1 * filter.attr('data-filter-max');

                    console.log(min_price, max_price);

                    filtered = $.map(servers_data, function (el, index) {
                        if (el.hasOwnProperty(filter_name) === true) {
                            var param = el[filter_name];

                            if (param * 1 > min_price && param * 1 < max_price) {
                                return el;
                            }
                        }
                    });
                }

                if (filtered.length) {
                    for (var j = 0; j < filtered.length; j++) {
                        arr.push(filtered[j])
                    }
                }
            }
        });


    });

    current_servers = arr.length ? arrayUnique(arr) : servers_data;

    reloadItems(current_servers.sort(compare));

    /*
    
        for (var i = 0; i < filter_list.length; i++) {
            var item = filter_list[i];
    
            $('.applyFilter').each(function () {
                var filter = $(this);
                if (filter.attr('data-filter') == item && filter.is(':checked')) {
                    var f = {name: item, val: filter.is(':checked')};
    
                    checked_filters.push(f);
                }
            });
        }
    
        var filtered = $.grep(servers_data, function (el, index) {
            var ret = false;
    
            // console.log(el);
    
            for (var i = 0; i < checked_filters.length; i++) {
                var item = checked_filters[i].name,
                    val = checked_filters[i].val,
                    out_of_filter = true;
    
                if (el.hasOwnProperty(item) === true) {
                    var param = el[item];
    
                    if ('boolean' === typeof (val)) {
                        if (val == param) {
                            out_of_filter = false;
                            console.log(item, param, val);
                        }
                    }
                }
    
                console.log((!out_of_filter), ret, (!out_of_filter) || ret);
    
                ret = (!out_of_filter) || ret;
            }
    
            return ret;
        });*/

    // console.log(filtered, filtered.length);
}

function compare(a, b) {
    if (sort_asc) {
        return a.price_day - b.price_day;
    } else {
        return b.price_day - a.price_day;
    }
}

function reloadItems(arr) {
    var html = '';

    console.log(arr, arr.length);

    for (var i = 0; i < arr.length; i++) {
        var item = arr[i],
            name = (item.tariff_name).replace(/(Hyperl[e]{1,2})(.*)/ig, '$1'),
            suffix = (item.tariff_name).replace(/(Hyperl[e]{1,2}(.*))/ig, '$2');

        html +=
            '<div class="tr prodRow">' +
            '<div class="td _col_1">' +
            '<div class="prod_name">' +
            '<label class="radio_v1">' +
            '<input class="hide prodCheck" type="radio" name="product">' +
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
            addItem(item.cpu) +
            addItem(item.ram) +
            addItem(item.hdd) +
            '</p>' +
            '</div>' +
            '</div>' +
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