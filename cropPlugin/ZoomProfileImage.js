var globalZoom= 1;
var previousZoom =0.1;
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
      var image = document.getElementById('image');
      latestZoom = zoomer.valueAsNumber;
      globalZoom=latestZoom < previousZoom?globalZoom+(latestZoom-previousZoom):globalZoom+(latestZoom-previousZoom)
      previousZoom=latestZoom;
      image.style.webkitTransform = "scale("+globalZoom+")"+"rotate(" + globalRotate + "deg)" ;
      image.style.transform = "scale("+globalZoom+")"+"rotate(" + globalRotate + "deg)" ;
      });
},
   rotate : 
      function () {
      control.rotate =this;
      $(control.rotate.selector).on('change',function(){
      latestRotate=rotator.value;
      globalRotate=globalRotate < previousRotate?globalRotate+parseInt(latestRotate-previousRotate):globalRotate+parseInt(latestRotate-previousRotate)
      previousRotate= parseInt(latestRotate);
      document.getElementById('image').style.webkitTransform="rotate(" + globalRotate + "deg) scale("+ globalZoom +")";
      document.getElementById('image').style.transform="rotate(" + globalRotate + "deg) scale("+ globalZoom +")";
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
      
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
            $('#image').attr({"src": e.target.result,"style":"visibility:visible"});
            image=document.getElementById("image");
            }
            reader.readAsDataURL(input.files[0]);
        }
}


window.onload=function(){ 
    $('span.icon-Upload').hover(function(){
       $(this).css("cursor","pointer") 
    });
    $('span.icon-Upload').click(function(){
         $("#imgInp").click();
    });
    $("#imgInp").change(function() {
    $('div.photo-upload').attr("style","overflow: hidden;");
    readURL(this);
    });

}

