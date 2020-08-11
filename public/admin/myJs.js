$(document).ready(function(){
    $('#thumbnail').click(function(){
        $('#fileInput').click();
    });

    $('#enterComment').click(function(){
      addComment();
    })
})

function showMyImage(fileInput) {
    var files = fileInput.files;
      for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {
              continue;
            }
            var img=document.getElementById("thumbnail");
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

function addComment(){
  const content = $('#content').val();
  const newsId = $('#newsId').val();
  console.log(content);
  console.log(newsId);
  if(content.length != 0){
       $.ajax({
        url: '/comment/add',
        type: 'POST',
        data: {
          'content':content,
          'newsId': newsId
        },
        success: function (data) {
          console.log(data);
          $('#list_comment').append(data);
          $('#content').val('');
          
        setTimeout(function(){
            $('#demo-ajax').html(data);
          }, 3000);
        },
        error: function (e) {
        console.log(e.message);            
        }
  });
  }

}
