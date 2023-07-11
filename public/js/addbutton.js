
$(function(){
    
    //get all bird options and render it
    $.ajax( {
        url: "/addnewtrip/birds",
        method: "get",
        dataType: "json",
        success: function(result) {

            var j;

            var existedbird = JSON.parse(result);

            var birdOptions = ""; // innerhtml for all options


            for (j = 0; j < existedbird.length; j++) {

                // add each options to birdlist
                birdOptions = birdOptions.concat("<option>" + existedbird[j].name + "<option>");

            }
            
            // set the innerhtml of birdlist
            $('datalist.birds').html(birdOptions);
        
            
            // function of the add button of the bird
            $('#btn_addRow').click(function(){

                // a row of a selection bar
                var row =$(
                    '<div class="inline" style="width: 100%;height:35px;">\
                        <button class="inline deletebutton"><img style="height:35px;" src="/img/deletebutton.png"></button>\
                        <input type="text" class="birdselectbar" name="birdlist" list="birds" style="padding-left:10px; "/>\
                            <datalist id="birds" class="birds">\
                            </datalist>\
                    </div>'
                        
                );
                
                // add all options
                row.find('datalist.birds').append(birdOptions);
                
                // add function of delete button
                row.find('button.deletebutton').click(function(){
        
                    $(this).parent().remove();
                    $("#outprint").print("sadadas");
        
                });
                $('#selectrows').append(row);
            });
        },
        error: function() {
            alert("Failed to get bird data! Try again later!");
        }
    });

    // get all address options
    $.ajax({
        url: "/addnewtrip/address",
        method: "get",
        dataType: "json",
        success: function(result) {

            var i;

            var existedAddr = JSON.parse(result); 

            var addrOptions = ""; // store all addr options


            for(i = 0; i < existedAddr.length; i++) {

                // adding each options
                addrOptions = addrOptions.concat("<option>" + existedAddr[i].address + "<option>");

            }

            // set the innerHtml
            $('#addresslist').html(addrOptions);
        },
        error: function() {
            alert("Failed to get address data! Try again later!");
        }

    });

});
function delete_row(e) {
    e.parentElement.remove();
}