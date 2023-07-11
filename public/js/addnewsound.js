
$(function(){

    // function of sound adding button
    $('#btn_addRow').click(function(){

        // row of a sound bar
        var row =$(
            '<div class="inline soundbar" style="width: 100%;height:35px;"><button class="inline deletebutton"><img style="height:35px;" src="/img/deletebutton.png"></button>'+
            '<input style="width:40%; max-width:40%;"type="file" class="audioinput" accept="audio/*" name="sounds"/><audio controls class="soundplayer"><source src="" type="audio/flac"><embed src=""></audio></div>'
                
        );

        // add function of delete button
        row.find('button.deletebutton').click(function(){

            $(this).parent().remove();

        });

        // set the volume of the sound upload
        row.find('audio.soundplayer')[0].volume=0.5;

        // add the row into the sound section
        $('#selectrows').append(row);
    });


    // set all soundplayer volume
    var sounds = document.getElementsByClassName('soundplayer');
    var i;
    for (i = 0; i < sounds.length; i++) {
        sounds[i].volume = 0.5;
    }

    // function of delete a sound
    $("button.existedDelete").click(function() {


        if (confirm("Are you sure to delete this sound from the database?")) {

            var soundFileID = $(this).parent().find('div.soundID').attr('value'); // get the hidden input of that sound id

            var sendData = {soundFileID: soundFileID}; // json file sent by ajax

            let delSucc = false; // var that indicate if delete is successful

            $.ajax({
                url: "/addnewbird/deletesound",
                type: "POST",
                data: sendData,
                dataType: "json",
                async: false,
                success: function(result) {
                    
                    var dataRece = JSON.parse(result);
                    
                    // if the delete is successful
                    if(dataRece.success) {

                        delSucc = true;
                        alert("Delete successfully!");
                        

                    } else {

                        alert("Unable to delete. " + (dataRece.errmsg ? dataRece.errmsg : '') + " Please try again later!");

                    }

                    
                }, error: function() {


                    alert("Failed to delete, try again later!");


                }



            });

            // remove the sound from html if del is successful
            if(delSucc) {
                $(this).parent().remove();
            }
            

        }
    });


    // show delete button when hovering on the img
    $("div.imagebox").hover(function() {

        $(this).find("imgdelbut").show();

    }, function() {

        $(this).find("imgdelbut").hide();

    })



    // funciton of deleting img of a bird
    $("imgdelbut").click(function() {


        if(confirm("Are you sure to delete this image?")) {

            var imgFileID = $(this).parent().find('div.imgID').attr('value'); // file id of the img

            var sendData = {imgID: imgFileID};  // data sent by ajax

            let delSucc = false; // if the del is successful

            $.ajax({
                url: "/addnewbird/deleteimg",
                type: "POST",
                async: false,
                data: sendData,
                dataType: "json",
                success: function(result) {

                    var dataRece = JSON.parse(result);
                    
                    // if successful
                    if(dataRece.success) {

                        delSucc = true;
                        alert("Delete successfully!");
                        

                    } else {

                        alert("Unable to delete. " + (dataRece.errmsg ? dataRece.errmsg : '') + " Please try again later!");

                    }
                }, error: function() {

                    alert("Failed to delete, try again later!");

                }


            });

            
            // delete img from html if the del is successful 
            if(delSucc) {
                $(this).parent().parent().remove();
            }
            




        }
    });

});