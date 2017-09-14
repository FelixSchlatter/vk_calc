$(document).ready(function() {
/// BASIS KONF!
var keinestrecketext = "Es wurde keine Verbindung gefunden.<br/>Bitte rufen Sie uns an für eine nähere Auskunft: 071 223 1000";
var localID = 900;
var addPrice = 10.80;
var partnerID = ["28"];
var keinestreckediv = $("#bemerkungen");

function file(daten) {
    if (window.XMLHttpRequest)
        xhr_object = new XMLHttpRequest();
    else if (window.ActiveXObject)
        xhr_object = new ActiveXObject("Microsoft.XMLHTTP");
    else return (false);
    xhr_object.open("GET", daten, false);
    xhr_object.send(null);
    if (xhr_object.readyState == 4) return (xhr_object.responseText);
    else return (false);
}

function preisanfrage() {
    $('.loading').removeClass("hidden");
    var idexp = $('#id_from').first('option').val();
    var iddest = $('#id_to').first('option').val();
    var gewicht = $('#gewicht').val();
    var text = file('http://www.mutatis.ch/api/apiall.php?id_from=' + idexp + '&id_to=' + iddest + '&weight=' + gewicht);
    var json = eval('(' + text + ')');
    var nb_de_ergebnis = 0;
    var iDQuestion = 0;
    var bemerkung = '';
    var stunden;
    var minuten;
    var startcom = json.from.zip + ' ' + json.from.name;
    var zielcom = json.to.zip + ' ' + json.to.name;;
    var ergebnis = '';

    if (idexp == 0 || iddest == 0 || idexp == '' || iddest == '') {
        nb_de_ergebnis = 0;
        iDQuestion = 1;
    } else {
        for (var j = 0; j < json['api'].length; j++) {
            code = json['api'][j];

            if (json[code]['base_price_et'] > 1) {

                if (nb_de_ergebnis != 0) {
                    ergebnis += '';
                } else if (code == 999 || code == 900) {
                    var baseprice = json[code]['base_price_it'];
                    var finalsum = Math.abs(parseFloat(baseprice) + addPrice);

                    var idFrom1 = json['from'];
                    var idTo1 = json['to'];

                    if (typeof idFrom1['partenaires'] != "undefined") {
                        var idFrom2 = idFrom1['partenaires'];
                        var idFrom3 = idFrom2['0'];
                        var idFrom4 = idFrom3['id'];
                        var iDcheckFrom = idFrom4;
                    } else {
                        var newidFrom2 = idFrom1['id'];
                        var iDcheckFrom = idFrom2;
                    }

                    if (typeof idTo1['partenaires'] != "undefined") {
                        var idTo2 = idTo1['partenaires'];
                        var idTo3 = idTo2['0'];
                        var idTo4 = idTo3['id'];
                        var iDcheckTo = idTo4;
                    } else {
                        var newidTo2 = idTo1['id'];
                        var iDcheckTo = idTo2;
                    }

                    if (iDcheckFrom == partnerID || iDcheckTo == partnerID) {
                        ergebnis += '<div class="row ' + code + '">Preis inkl. MwSt. CHF <span class="preis">' + json[code]['base_price_it'] + '</span></div>';
                    } else {
                        ergebnis +=
                            '<div class="row ' + code + '">Preis inkl. MwSt. CHF <span class="preis">' + finalsum + '</span></div>';
                    }

                } // ende code 999
                else {
                    var baseprice = json[code]['base_price_it'];
                    var finalsum = Math.abs(parseFloat(baseprice) + addPrice);
                    ergebnis += '<div class="row ' + code + '">' + keinestrecketext + '</div>';
                }
                if (json[code]['weight_tax_et'] > 1) {
                    ergebnis += '<div class="row">Gewichtszuschlag (' + json[code]['weight_label'] + ') inkl. MwSt. CHF <span class="preis">' + json[code]['weight_tax_it'] + '</span></div>';
                }

                if (json[code]['time'] != '' && json[code]['time'] != 0) {
                    stunden = Math.trunc(json[code]['time'] / 60)
                    minuten = json[code]['time'] - 60 * Math.trunc(json[code]['time'] / 60);
                    if (minuten < 10) {
                        minuten = '0' + minuten;
                    }
                    if (code == 999) {
                        ergebnis += '<div class="row">Ungefähre Dauer der Lieferung: ' + stunden + 'h' + minuten + '</div>';
                    } else {
                        //ergebnis += '<div class="row ' + code + '">' + keinestrecketext + '</div>';
                    }
                }
                nb_de_ergebnis++;
            }
        }
    }
    ergebnis += '</div>';
    $('.loading').addClass("hidden");

    if (nb_de_ergebnis != 0) {} else {
        if (iDQuestion == 1) {
            bemerkung = '<div class="row">' + keinestrecketext + '</div>';
        } else {
            bemerkung = '<div class="row">' + keinestrecketext + '</div>';
        }
    }

    $('#bemerkungen').html(bemerkung);
    $('#ergebnis').html(ergebnis);

    $(idexp).val('');
    $(iddest).val('');
}


  $("#superbutton").click(preisanfrage);


    var plzID = function() {
        if (1 === 1) {
            $('#calculator').removeClass('hidden');
        } else {
            $('#zip_error').removeClass('hidden');
        }
        $(".select-zip").select2({
            language: "de",
            amdLanguageBase: "de.js",
            placeholder: 'Postleitzahl',
            multiple: false,
            selectOnClose: true,
            ajax: {
                url: "http://www.mutatis.ch/api/apizip.php",
                dataType: 'json',
                delay: 1,
                data: function(params) {
                    return {
                        zip: params.term,
                    };
                },
                processResults: function(data, params) {
                    if (data) {
                        var lengthRes = Object.keys(data).length;
                        data.cities = [];
                        for (i = 1; i < (lengthRes + 1); i++) {
                            data[i].text = data[i].zip + ' ' + data[i].name
                            data.cities.push(data[i]);
                        }
                        return {
                            results: data.cities,
                        };
                    } else {
                        return false;
                    }

                },
                cache: true
            },
            escapeMarkup: function(markup) {
                return markup;
            },
            minimumInputLength: 1,
            templateResult: function(data) {
                if (data.loading) {
                    return false;
                } else {
                    return data.zip + ' ' + data.name;
                }
            }
        });
    }
    plzID();
});