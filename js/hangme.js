/* Copyright 2013 Gabriel Eugen Vaduva

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
//var words = ["ΠΛΗΡΟΦΟΡΙΚΗ", "ΔΗΜΟΤΙΚΟ"];

var cat_history = ['ΔΩΡΙΕΙΣ', 'ΚΑΘΟΔΟΣ', 'ΕΠΑΝΑΣΤΑΣΗ', 'ΝΑΥΜΑΧΙΑ', 'ΑΘΗΝΑ', 'ΣΠΑΡΤΗ', 'ΠΕΡΣΕΣ'];
var cat_sports = ['ΠΟΔΟΣΦΑΙΡΟ', 'ΜΠΑΣΚΕΤ', 'ΑΓΩΝΑΣ', 'ΠΕΤΟΣΦΑΙΡΙΣΗ', 'ΤΕΝΙΣ', 'ΥΔΑΤΟΣΦΑΙΡΙΣΗ', 'ΑΝΤΙΣΦΑΙΡΙΣΗ' ];
var cat_maths = ['ΠΡΟΣΘΕΣΗ', 'ΑΦΑΙΡΕΣΗ', 'ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ', 'ΔΙΑΙΡΕΣΗ', 'ΚΡΑΤΟΥΜΕΝΟ', 'ΔΙΑΙΡΕΤΕΟΣ', 'ΔΙΑΙΡΕΤΗΣ', 'ΓΙΝΟΜΕΝΟ', 'ΑΘΡΟΙΣΜΑ', 'ΔΙΑΦΟΡΑ'];
var cat_geography = ['ΕΛΛΑΔΑ', 'ΠΕΛΛΑ', 'ΓΙΑΝΝΙΤΣΑ', 'ΕΔΕΣΣΑ', 'ΣΚΥΔΡΑ', 'ΑΡΙΔΑΙΑ', 'ΘΕΣΣΑΛΟΝΙΚΗ', 'ΑΘΗΝΑ', 'ΙΤΑΛΙΑ', 'ΓΕΡΜΑΝΙΑ', 'ΛΟΥΔΙΑΣ'];
var cat_hy = ['ΠΥΡΓΟΣ', 'ΟΘΟΝΗ', 'ΠΛΗΚΤΡΟΛΟΓΙΟ', 'ΠΟΝΤΙΚΙ', 'ΕΚΤΥΠΩΤΗΣ', 'ΣΑΡΩΤΗΣ', 'ΜΝΗΜΗ', 'ΛΑΠΤΟΠ', 'ΗΧΕΙΑ', 'ΜΙΚΡΟΦΩΝΟ', 'ΚΑΜΕΡΑ', 'ΙΝΤΕΡΝΕΤ'];
var cat_ergonomy = ['ΑΥΧΕΝΑΣ', 'ΠΛΑΤΗ', 'ΜΕΣΗ', 'ΚΑΡΠΟΣ', 'ΑΣΤΡΑΓΑΛΟΣ', 'ΓΟΝΑΤΟ', 'ΕΡΓΟΝΟΜΙΑ'];


function drawWord(wo, gu)
{
    var nword = ""; var ok;
    for (var i = 0; i < wo.length; i++) {
        ok = false;
        for (var j = 0; j < gu.length; j++)
        {
            if (gu[j] == wo[i]) {
                nword = nword + wo[i].toUpperCase() + ' ';
                ok = true;
                break;
            }
        }
        if (!ok) nword = nword + '_ ';
    }
    $('#theword').html(nword);
}

function checkWin(p)
{
    for (var i = 0; i < p.length; i++)
        if (p[i] == '_') return false;
    return true;
}

function gup( name, url ) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}

/** FROM https://www.kevinleary.net/javascript-get-url-parameters/
 * JavaScript Get URL Parameter
 * 
 * @param String prop The specific URL parameter you want to retreive the value for
 * @return String|Object If prop is provided a string value is returned, otherwise an object of all properties is returned
 */
function getUrlParams( prop ) {
    var params = {};
    var search = decodeURIComponent( window.location.href.slice( window.location.href.indexOf( '?' ) + 1 ) );
    var definitions = search.split( '&' );

    definitions.forEach( function( val, key ) {
        var parts = val.split( '=', 2 );
        params[ parts[ 0 ] ] = parts[ 1 ];
    } );

    return ( prop && prop in params ) ? params[ prop ] : params;
}

function set_category(category) {
    sessionStorage.setItem('selected_category', category);
    sessionStorage.setItem('words_played', '');
}

function change_category() {
    $("#alx_debug").dialog("open");
}

function unserialize_played_words() {
    return sessionStorage.getItem('words_played').split('||');
}

function update_available_words(all_words) {
    var available_words = [];
    var words_played = unserialize_played_words();
    for (var i=0; i<all_words.length; i++) {
        if ($.inArray(all_words[i], words_played)==-1)
            available_words.push(all_words[i])
    }
    return available_words;
}

function has_the_word_played(w) {
    var words_played = sessionStorage.getItem('words_played').split('||');
    for (var i=0; i<words_played.length; i++) {
        if (words_played[i]==w)
            return true;
    }
    return false;
}

$(document).ready(start_game());

function start_game() {

    var alx_params = getUrlParams();

    $("#alx_debug").dialog({
        autoOpen : false, 
        modal : true, 
        show : "blind", 
        hide : "blind",
        height: 400,
        width: 350,
        title: "Επιλογή κατηγορίας",
        buttons: {
            Cancel: function() {
                //$( this ).dialog('close');
                $("#alx_debug").dialog("close");
            }
          },
          close: function() {
            form[ 0 ].reset();
            allFields.removeClass( "ui-state-error" );
          }
    });

    var words=[];
    if (sessionStorage.getItem('selected_category')==null) {
        $("#alx_debug").dialog("open");
        return;
    }
    
    switch (sessionStorage.getItem('selected_category')) {
        case "history":
            $("#alx_category").html("Κατηγορία: Ιστορία");
            words = cat_history;
            break;
        case "sports":
            $("#alx_category").html("Κατηγορία: Αθλητικά");
            words = cat_sports;
            break;
        case "maths":
            $("#alx_category").html("Κατηγορία: Μαθηματικά");
            words = cat_maths;
            break;
        case "geography":
            $("#alx_category").html("Κατηγορία: Γεωγραφία");
            words = cat_geography;
            break;
        case "hy":
            $("#alx_category").html("Κατηγορία: Ηλ. Υπολογιστές");
            words = cat_hy;
            break;
        case "ergonomy":
            $("#alx_category").html("Κατηγορία: Εργονομία");
            words = cat_ergonomy;
            break;
        default:
            break;
    }
    if (sessionStorage.getItem("words_played")!=null) {
        var available_words = update_available_words(words);
        if (available_words.length==0) {
            if (confirm("Έπαιξες όλες τις λέξεις της κατηγορίας. Συνέχεια με επιλογή άλλης κατηγορίας")) {
                sessionStorage.setItem('words_played', "");
                $("#alx_debug").dialog("open");
                return;
            } else {
                window.location = "http://sxoleio.pw";
            }
        }
        console.log("The available words: " + available_words);
        words = available_words;
    } 
    var w = words[Math.floor(Math.random() * words.length)];
   

    // Έλεγχος αν έχει εμφανιστεί ήδη η λέξη
    if (sessionStorage.getItem('words_played')!=null) {
        if (has_the_word_played(w)) {
            alert('η λέξη ' + w + ' έχει ξαναπαίξει!');
            //draw_again
        } else {
            if (sessionStorage.getItem('words_played')==='')
                sessionStorage.setItem('words_played', w);    
            else
                sessionStorage.setItem('words_played', sessionStorage.getItem('words_played') + '||' + w);
            var index = words.indexOf(w);
            if (index !== -1) words.splice(index, 1);
            console.log('Διαθέσιμες λέξεις: ' + words);

        }
    } else {
        sessionStorage.setItem('words_played', w);
    }


    var guess = "";
    var t = 0;
    var c = document.getElementById("display");
    var ctx = c.getContext("2d");
    ctx.font="30px Arial";
    ctx.strokeText("Κρεμάλα",235,50);
    drawWord(w, guess);
    $('#letters a').click(function(){
        var vl = $(this).attr('value');
        if (w.indexOf(vl) != -1)
        {
            guess = guess + vl;
            $(this).hide();
            drawWord(w, guess);
            if (checkWin($('#theword').html())) {
                $('#msg').html('<img src="images/thumbs_up.png"><a href="index.html"><img src="images/replay.png"></a>');
                $('#msg').effect( "bounce", "slow" );
                $('#letters').hide();
            }
        } else {
            t++;
            $(this).hide();
            $('#alx_num_moves').html(7-t);
            switch(t)
            {
                case 1: {
                    ctx.moveTo(200, 300);
                    ctx.lineTo(200, 100);
                    ctx.stroke();
                } break;
                case 2: {
                    ctx.moveTo(200, 100);
                    ctx.lineTo(325, 100);
                    ctx.stroke();
                } break;
                case 3: {
                    ctx.moveTo(325, 100);
                    ctx.lineTo(325, 130);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(325,150,20,0,2*Math.PI);
                    ctx.closePath();
                    ctx.stroke();
                } break;
                case 4: {
                    ctx.moveTo(325, 170);
                    ctx.lineTo(325, 230);
                    ctx.stroke();
                } break;
                case 5: {
                    ctx.moveTo(325, 180);
                    ctx.lineTo(300, 215);
                    ctx.stroke();
                    ctx.moveTo(325, 180);
                    ctx.lineTo(350, 215);
                    ctx.stroke();
                } break;
                case 6: {
                    ctx.moveTo(325, 230);
                    ctx.lineTo(300, 265);
                    ctx.stroke();
                    ctx.moveTo(325, 230);
                    ctx.lineTo(350, 265);
                    ctx.stroke();
                } break;
                case 7: {
                    var img = new Image();
                    img.onload = function(){ ctx.drawImage(img,300,240); };
                    img.src = "images/fire.png"; 
                } break;
            }

            if (t == 7) {
                $('#msg').html('Δυστυχώς έχασες!.');
                $('#letters').hide();
                $('#theword').html(w.toUpperCase());
            }
        }
    });
}
