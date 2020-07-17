$(document).ready(function(){
	
	$('.edit').click(function(){
		$(this).hide();
		$(this).prev().hide();
		$(this).next().show();
		$(this).next().select();
	});
	
	
	$('input[type="text"]').blur(function() {  
         if ($.trim(this.value) == ''){  
			 this.value = (this.defaultValue ? this.defaultValue : '');  
		 }
		 else{
			 $(this).prev().prev().html(this.value);
		 }
		 
		 $(this).hide();
		 $(this).prev().show();
		 $(this).prev().prev().show();
     });
	  
	  $('input[type="text"]').keypress(function(event) {
		  if (event.keyCode == '13') {
			  if ($.trim(this.value) == ''){  
				 this.value = (this.defaultValue ? this.defaultValue : '');  
			 }
			 else
			 {
				 $(this).prev().prev().html(this.value);
			 }
			 
			 $(this).hide();
			 $(this).prev().show();
			 $(this).prev().prev().show();
		  }
	  });

	  $('input[type="date"]').blur(function() {  
		if ($.trim(this.value) == ''){  
			this.value = (this.defaultValue ? this.defaultValue : '');  
		}
		else{
			$(this).prev().prev().html(this.value);
		}
		
		$(this).hide();
		$(this).prev().show();
		$(this).prev().prev().show();
	});
	 
	 $('input[type="date"]').keypress(function(event) {
		 if (event.keyCode == '13') {
			 if ($.trim(this.value) == ''){  
				this.value = (this.defaultValue ? this.defaultValue : '');  
			}
			else
			{
				$(this).prev().prev().html(this.value);
			}
			
			$(this).hide();
			$(this).prev().show();
			$(this).prev().prev().show();
		 }
	 });
		  
});

function showMyImage(fileInput) {
    var files = fileInput.files;
      for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {
              continue;
            }
            var img=document.getElementById("imgava");
            img.file = file;
            var reader = new FileReader();
            reader.onload = (function(aImg) {
            return function(e) {
            aImg.src = e.target.result;
                        };
            })(img);
             reader.readAsDataURL(file);
          }
}