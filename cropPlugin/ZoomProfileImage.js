var globalZoom= 0;
var previousZoom =0;
var previousRotate =0;
var globalRotate = 0;
var control={};
$(document).ready(function(){
    var methods = {
        init : function(options) {
        },
   zoom : function (){ 
   control.zoomer =this;
   $(control.zoomer.selector).on('change',function(){
      latestZoom = parseFloat(zoomer.valueAsNumber);
      globalZoom=previousZoom==0?0:globalZoom;
      globalZoom+=latestZoom-previousZoom
      previousZoom=latestZoom;
      ChangeImageAxis("modalImage");
      });
},
   rotate : 
      function () {
      control.rotate =this;
      $(control.rotate.selector).on('change',function(){
      globalZoom=globalZoom==0?1:globalZoom;
      latestRotate=parseInt(rotator.value);
      globalRotate+=(latestRotate-previousRotate)
      previousRotate= parseInt(latestRotate);
      ChangeImageAxis("modalImage");
      });
},    
    };
    $.fn.cropImage = function(methodOrOptions) {
        if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            // Default to "init"
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.tooltip' );
        }    
    }; 
});

function readURL(input) {
      
        if (input.files && input.files[0] || input.value) {
            var reader = new FileReader();
            reader.onload = function(e) {
            $('.cropImage').each(function(){
                $(this).attr({"src": e.target.result,"style":"visibility:visible"})
                });
             EditImageClick();
             control.originalImage=e.target.result;
            }
            reader.readAsDataURL(input.files[0]);
            $('#imgInp').val('');
        }
}
function RemoveImage(){
     $('.cropImage').each(function(){
        $(this).attr({"src": "#","style":"visibility:visible"})
    });
    CloseImageEditor();
    $('span.icon-Edit').off('click');
    $('span.icon-Edit').attr("class","icon-Upload");
    $('div.photo-upload').attr("style","overflow: none;");
    $('.cropImage').each(function(){
            $(this).hide();
        });
    control.saved=false; // turn off the saved control to reset the input controls
    ImageChangesCancelled();
    if($._data( $('span.icon-Upload')[0], 'events' ).click.length == 0)   
     {
        UploadImageClick();
     }
}

window.onload=function(){ 
        $('#rotator').cropImage("rotate","image"); //Plugin to zoom and rotate the image .Select the control  id and pass the control  and pass the image id to rotate
        $('#zoomer').cropImage("zoom","image");
        UploadImageClick();
        OnRangeChanged();
}
 function ShowImageEditor(){
        var span = document.getElementsByClassName("close")[0];
        modal = document.getElementById('myModal');
        modal.style.display = "block";
        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
        modal.style.display = "none";
        $('body').removeAttr('style');
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
                $('body').removeAttr('style');
            }
        }
        $('body').css('overflow', 'hidden');
    }
function CloseImageEditor(){
    $('body').removeAttr('style');
    $('#myModal').hide();$('span.icon-Upload').click(function(){$('#imgInp').click();});
}

function OnRangeChanged(){
    $('input[type="range"]').change(function () {
        var val = ($(this).val() - $(this).attr('min')) / ($(this).attr('max') - $(this).attr('min'));
           $(this).css('background-image',
                '-webkit-gradient(linear, left top, right top, '
                + 'color-stop(' + val + ', #008d96), '
                + 'color-stop(' + val + ', #C5C5C5)'
                + ')'
                );
          });
    $('#zoomer').on("change",function(){
         $('#zoomerLbl').text(parseInt(($(this).val()-1)*100)+'%');
    });
    $('#rotator').on("change",function(){
         $('#rotatorLbl').text($(this).val());
    });
}

function ChangeImageAxis(image){
        image=document.getElementById(image);
        image.style.webkitTransform = "scale("+globalZoom+")"+"rotate(" + globalRotate + "deg)" ;
        image.style.transform = "scale("+globalZoom+")"+"rotate(" + globalRotate + "deg)" ;
}

function ImageChangesCancelled(){
    if(!control.saved){
        globalZoom=1;globalRotate=0;previousZoom=0;previousRotate=0;
        $('#zoomer').val(1);
        $('#zoomerLbl').text(($('#zoomer').val()-1)*100+'%');
        $('#rotator').val(-45);
        $('#rotatorLbl').text($('#rotator').val());
        ChangeImageAxis('modalImage');
        ChangeImageAxis('profileImage');
        $('input[type="range"]').each(function(){
            $(this).attr('style','background-image:-webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(0.0, rgb(0, 141, 150)), color-stop(0.0, rgb(197, 197, 197)));');
        });
    }
    CloseImageEditor();
}

drawImageOnCanvas=function(){
   xPos=yPos=$('canvas')[0].width/2;
   $("#canvas").clearCanvas();
   $("#canvas").drawArc({
    mask: true,
    x:xPos ,y: yPos
    ,radius: $('canvas')[0].width/2
    }).translateCanvas({
     translateX:  parseInt($("#draggable").css("left"))
    ,translateY:  parseInt($("#draggable").css("top"))
    }).drawImage({
    source: control.originalImage,
    strokeStyle: '#000',
    x:xPos ,y: yPos
    ,width:$('canvas')[0].width
    ,height:$('canvas')[0].width
    ,fromCenter: true
    ,scale: globalZoom
    ,rotate :globalRotate 
    }).restoreCanvas({layer:false});
    control.modifiedImage=document.getElementById("canvas").toDataURL();
    $('#hdnModifiedImage').val(control.modifiedImage); // Stored the value of base64 in this hidden varriable
    $('#profileImage').attr({'src':control.modifiedImage});
    $("#modalImage").attr('src',control.originalImage);
}
function onsuccess(response){ console.log(response) }

function SendImageTransformations(){
    postedData={"zoom":globalZoom,"rotate":globalRotate}
    // postedData=document.getElementById("canvas").toDataURL();;
    url="http://httpbin.org/get";
    $.ajax({
    type: 'GET',
    url: url,
    dataType: 'json',
    data:postedData,
    success: onsuccess
    });
}

function downloadCanvas(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
}

function UploadImageClick(){
      $('span.icon-Upload,span.icon-Edit').hover(function(){
        $(this).css("cursor","pointer") ;
            });
        $('span.icon-Upload').click(function(){
            $("#imgInp").click();
            });
        $("#imgInp").change(function() { // on change of add icon upload 
            $('div.photo-upload').attr("style","overflow: hidden;");
            readURL(this);
        });
}
function EditImageClick(){
                $('span.icon-Upload').off('click');
                $('div.photo-upload').attr("style","overflow: hidden;");
                $('span.icon-Upload').attr("class","icon-Edit");    
                $('span.icon-Edit').click(function(){
                $( "#draggable" ).draggable();
                ShowImageEditor();
                    });          
}
