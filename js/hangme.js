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

var cat_history = ['ΔΩΡΙΕΙΣ'];
var cat_sports = ['ΠΟΔΟΣΦΑΙΡΟ', 'ΜΠΑΣΚΕΤ'];



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


$(document).ready(function(){

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
              dialog.dialog( "close" );
            }
          },
          close: function() {
            form[ 0 ].reset();
            allFields.removeClass( "ui-state-error" );
          }
    });
    
    // next add the onclick handler
    $("#alx_show_dialolg").click(function() {
      $("#alx_debug").dialog("open");
      return false;
    });

    var words=[];
    Object.keys(alx_params).forEach(function(key) {
        if (key=="cat") {
            if (alx_params[key]=='history')
                words = cat_history;
            if (alx_params[key]=='sports')
                words = cat_sports;
        }
    });

    if (gup('q')==null)
      var w = words[Math.floor(Math.random() * words.length)];
    else {
      if (eval('typeof words' + gup('q')) === 'undefined') {
        var w = words[Math.floor(Math.random() * words.length)];
      }
      else {
        var fwords = eval('words'+gup('q'));
        var w = fwords[Math.floor(Math.random() * fwords.length)];
      }

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
                $('#msg').html('Μπράβο! Βρήκες τη λέξη!.');
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
});
