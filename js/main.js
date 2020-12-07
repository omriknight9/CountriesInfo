
const baseUrl = 'https://restcountries.eu/rest/v2/';

let borderArr = [];
let languagesArr = [];
let currencysArr = [];
let timezonesArr = [];

$(document).ready(function (event) {

    $('.Xbtn').click(function () {
        $(this).parent().parent().hide();
    })

    getAll();

    window.onscroll = function () {
        scrollBtn();
    };

    $('#search').on('input', function () {
        for (let i = 0; i < $('.countryContainer').length; i++) {
            let countryName = $($('.countryContainer')[i]).find($('.countryName')).html().toLowerCase();
            let searchVal = $('#search').val().toLowerCase();

            if (countryName.includes(searchVal)) {
                $($('.countryContainer')[i]).show();
            } else {
                $($('.countryContainer')[i]).hide();
            }
        }
    })
})

function scrollBtn() {
    if ($(this).scrollTop() > 550) {
        $('#goToTopBtn').fadeIn();
    }
    else {
        $('#goToTopBtn').fadeOut();
    }
}

function goToTop() {
    $('html,body').animate({ scrollTop: 0 }, 'slow');
}

function getAll() {

    $('#spinnerWrapper').fadeIn('fast');
    $('#searchContainer, #container, #goToTopBtn').css({'pointer-events': 'none', 'opacity': '.5'});
    
    setTimeout(function () {
        $.get(baseUrl + 'all', function (json) {

            for (let i = 0; i < json.length; i++) {

                let countryContainer = $('<div>', {
                    class: 'countryContainer',
                    'alphaCode': json[i].alpha2Code,
                }).appendTo($('#container'));

                let countryName = $('<p>', {
                    text: json[i].name,
                    class: 'countryName'
                }).appendTo(countryContainer);

                let countryImg = $('<img>', {
                    src: json[i].flag,
                    class: 'countryImg',
                    click: function () {
                        getCountryData($(this).parent().attr('alphaCode'));
                    }
                }).appendTo(countryContainer);
            }
            $('#spinnerWrapper').css('display', 'none');
            $('#searchContainer, #container, #goToTopBtn').css({'pointer-events': 'all', 'opacity': '1'});
        })
    }, 1500)
}

function getCountryData(country) {

    $('#spinnerWrapper').fadeIn('fast');
    $('#searchContainer, #container, #goToTopBtn').css({'pointer-events': 'none', 'opacity': '.5'});

    $('.borderDesc').remove();
    borderArr = [];
    languagesArr = [];
    currencysArr = [];
    timezonesArr = [];
    $('#countryBorders').empty();

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: baseUrl + 'alpha/' + country,
        dataType: "json",
        success: function (data) {
            $('#countryNamePop').html(data.name);
            $('#countryCapital').html('Capital: ' + data.capital);
            
            if (data.borders.length !== 0) {
                $('#countryBorders').show();
                $.each(data.borders, function (key, value) {
                    getBorderName(value);
                });

            } else {
                $('#countryBorders').hide();
            }

            if (data.languages.length !== 0) {
                $('#countryLanguages').show();
                $.each(data.languages, function (key, value) {
                    languagesArr.push(value.name);
                    languagesArr.join(' , ');

                    if (languagesArr.length == 1) {
                        $('#countryLanguages').html('Language: '+ languagesArr.join(', ').trim());
                    } else {
                        $('#countryLanguages').html('Languages: '+ languagesArr.join(', ').trim());
                    }
                });

            } else {
                $('#countryLanguages').hide();
            }
            
            if (data.currencies.length !== 0) {
                $('#countryCurrency').show();
                $.each(data.currencies, function (key, value) {
                    currencysArr.push(value.name + '(' + value.symbol + ')');
                    currencysArr.join(' , ');

                    if (currencysArr.length == 1) {
                        $('#countryCurrency').html('Currency: '+ currencysArr.join(', ').trim());
                    } else {
                        $('#countryCurrency').html('Currencies: '+ currencysArr.join(', ').trim());
                    }
                });

            } else {
                $('#countryCurrency').hide();
            }

                        
            if (data.timezones.length !== 0) {
                $('#countryTimeZone').show();
                $.each(data.timezones, function (key, value) {
                    timezonesArr.push(value);
                    timezonesArr.join(' , ');

                    if (timezonesArr.length == 1) {
                        $('#countryTimeZone').html('Timezone: '+ timezonesArr.join(', ').trim());
                    } else {
                        $('#countryTimeZone').html('Timezones: '+ timezonesArr.join(', ').trim());
                    }
                });

            } else {
                $('#countryTimeZone').hide();
            }

            setTimeout(function() {

                for (let i = 0; i < borderArr.length; i++) {

                    if (i == 0) {
                        let finalBorderHead;
                        if (borderArr.length == 1) {
                            finalBorderHead = 'Border: ';
                        } else {
                            finalBorderHead = 'Borders: '
                        }

                        let borderCountryHead = $('<span>', {
                            text: finalBorderHead,
                            class: 'borderCountryHead'
                        }).appendTo($('#countryBorders'));   
                    }

                    let finalBorderText;

                    if (i == borderArr.length - 1) {
                        finalBorderText = borderArr[i];
                    } else {
                        finalBorderText = borderArr[i] + ', ';
                    }

                    let borderCountry = $('<span>', {
                        text: finalBorderText,
                        country: borderArr[i],
                        class: 'borderCountry',
                        click: function() {
                            getBorderCountryData($(this).attr('country'));
                        }
                    }).appendTo($('#countryBorders'));     
                }

                $('#spinnerWrapper').hide();
                $('#searchContainer, #container, #goToTopBtn').css({'pointer-events': 'all', 'opacity': '1'});
                $('#countryDetails').show();
                removePopup($('#countryDetails'));
            }, 1000);
        },

        error: function (err) {
            $('#technicalProblem').show();
        }
    })
}

function getBorderCountryData(country) {
    $.get(baseUrl + 'name/' + country + '?fullText=false', function (data) {
        $('#countryDetails').hide();
        getCountryData(data[0].alpha2Code);
    });
} 

function getBorderName(border) {

    $.ajax({
        type: 'GET',
        crossDomain: true,
        url: baseUrl + 'alpha/' + border,
        dataType: "json",
        success: function (data) {
            let finalCountryName;

            if (data.name.includes('(')) {
                finalCountryName = data.name.replace(/ *\([^)]*\) */g, "");
            } else {
                finalCountryName = data.name;
            }

            borderArr.push(finalCountryName);
            borderArr.join(' , ');
        },

        error: function (err) {
            $('#technicalProblem').show();
        }
    })
}

function removePopup(container) {

    $(document).mouseup(function (e) {
        if (container.is(e.target) && container.has(e.target).length === 0) {
            container.hide();
            e.stopPropagation();
            $(document).off('mouseup');
        }
    })
}

function closeCurrentPopup(that) {
    $($(that)[0].parentElement.parentElement.parentElement).hide();
}
