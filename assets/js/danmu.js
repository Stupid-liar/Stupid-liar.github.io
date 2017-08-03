(function(){
$("#danmu").danmu({
	left:0,
	top:0,
	height:"100%",
	width:"100%",
    speed:30000,
    opacity:1,
    font_size_small:16,
    font_size_big:24,
      top_botton_danmu_time:6000
}
  );
})(jQuery);
    query();
    timedCount();
    var first=true;

function timedCount() {
   $("#time").text($('#danmu').data("nowtime"));
   t=setTimeout("timedCount()",50);
    }

function starter(){
  $('#danmu').danmu('danmu_start');
}

function pauser(){
  $('#danmu').danmu('danmu_pause');
}

function resumer(){
  $('#danmu').danmu('danmu_resume');
}

function stoper(){
  $('#danmu').danmu('danmu_stop');
}

function getime(){
  alert($('#danmu').data("nowtime"));
}

function getpaused(){
  alert($('#danmu').data("paused"));
}

function add(){
var newd={"text":"new2" , "color":"green" ,"size":"1","position":"0","time":60};
  $('#danmu').danmu("add_danmu",newd);
}

function insert(){
  var newd= { "text":"new2" , "color":"green" ,"size":"1","position":"0","time":50};
  str_newd=JSON.stringify(newd);
  $.post("stone.php",{danmu:str_newd},function(data,status){alert(data)});
}

function query() {
  $.get("query.php",function(data,status){
     var danmu_from_sql=eval(data);
     for (var i=0;i<danmu_from_sql.length;i++){
      var danmu_ls=eval('('+danmu_from_sql[i]+')');
      $('#danmu').danmu("add_danmu",danmu_ls);
     }
  });
}

function ajaxSendBarrage(text,barrage_time) {
        var file_path = $('#ppt_hold').css('background-image')
        var splits = file_path.split('/')
        var ppt_name = splits[splits.length-2]
        var data = {
        "text": text,
        "time": barrage_time,
        "ppt_name":ppt_name
        }
        $.ajax({
        type: 'POST',
        url: './api/ppt_barrage',
        async: false,
        data: data,
        dataType: 'json',
        });
        }

function ajaxShowDbBarrage() {
    var file_path = $('#ppt_hold').css('background-image');
    var splits = file_path.split('/');
    var ppt_name = splits[splits.length-2];
    var data = {"ppt_name":ppt_name
    };
        $.ajax({
        type: 'POST',
        url: './api/ppt_barrage/db',
        async: false,
        data: data,
        dataType: 'json',
        success: function(data) {
            var barrages = data['barrages'];
            for(var barrage in barrages){
                var barrage_text = barrages[barrage].barrage_text;
                var barrage_time = barrages[barrage].barrage_time;
                var oPNode = document.getElementById('danmu_list');//获取p节点的对象
                var node = document.createElement('p');//创建一个文本节点
                node.innerHTML = barrage_time+"&nbsp;&nbsp;&nbsp;&nbsp;"+barrage_text;//文本内容
                oPNode.appendChild(node);//将创建的文本内容插入到p节点中,追加方式
                showDbBarrage(barrage_text);
            }
        }
        });


}

function send(){
  var text = document.getElementById('text').value;
  var color = document.getElementById('color').value;
  var position = document.getElementById('position').value;
  var time = $('#danmu').data("nowtime")+5;
  var size =document.getElementById('text_size').value;
  var text_obj='{ "text":"'+text+'","color":"'+color+'","size":"'+size+'","position":"'+position+'","time":'+time+'}';
  $.post("stone.php",{danmu:text_obj});
  var text_obj='{ "text":"'+text+'","color":"'+color+'","size":"'+size+'","position":"'+position+'","time":'+time+',"isnew":""}';
  var new_obj=eval('('+text_obj+')');
  $('#danmu').danmu("add_danmu",new_obj);
  document.getElementById('text').value='';
  var today=new Date();
  var month=today.getMonth();
  month=month>9?month:"0"+month;
  var date=today.getDate();
  date=date>9?date:"0"+date;
  var hour=today.getHours();
  hour=hour>9?hour:"0"+hour;
  var min=today.getMinutes();
  min=min>9?min:"0"+min;
  var sec=today.getSeconds();
    sec=sec>9?sec:"0"+sec;
  var s=today.getFullYear()+"-"+month+"-"+date+" "+hour+":"+min+":"+sec+" ";

  ajaxSendBarrage(text,s);
  var oPNode = document.getElementById('danmu_list');//获取p节点的对象
  var node = document.createElement('p');//创建一个文本节点
  node.innerHTML = s+"&nbsp;&nbsp;&nbsp;&nbsp;"+text ;//文本内容
  oPNode.appendChild(node);//将创建的文本内容插入到p节点中,追加方式

}


function sc()
{
var e=document.getElementById("div1")
e.scrollTop=e.scrollHeight;
}
var s=setInterval("sc()",200);

function op(){
var op=document.getElementById('op').value;
 $('#danmu').data("opacity",op);
}

function changehide() {
	var op = document.getElementById('op').value;
	op = op / 100;
	if (document.getElementById("ishide").checked) {
		jQuery('#danmu').data("opacity", op);
		jQuery(".flying").css({
			"opacity": op
		});
	} else {
		jQuery('#danmu').data("opacity", 0);
		jQuery(".flying").css({
			"opacity": 0
		});
	}
}

function settime(){
	var t=document.getElementById("set_time").value;
	t=parseInt(t)
	console.log(t)
	$('#danmu').data("nowtime",t);
}
	</script>
<script>
    var folds_size = 0;
    /*
    PPT页数向左翻页
     */

function picChangeLeft(which) {
    var ppt_hold = document.getElementById('ppt_hold');
    var title = ppt_hold.getAttribute('title');
    var pic_num = parseInt(title);
    if(pic_num - 1 < 0){
        pic_num = 0;
    }
    else{
        pic_num -= 1;
    }
    ppt_hold.setAttribute('title',pic_num.toString());
    var url_path = $('#ppt_hold').css('background-image');
    var oppo_path = url_path.match('ppt_barrage/(.*?)"')[1];
    oppo_path = oppo_path.replace(/[0-9]\d*.jpg/,pic_num.toString() + '.jpg');
    var command = './' + oppo_path;
    command = 'url("' + command + '")';
    $('#ppt_hold').css('background-image',command);
    var input=document.getElementById("input");
    input.value=pic_num + 1;
}
    /*
    PPT页数向右翻页
     */
function picChangeRight(which) {


    var ppt_hold = document.getElementById('ppt_hold');
    var title = ppt_hold.getAttribute('title');
    var pic_num = parseInt(title);
    if(pic_num + 1 >= folds_size){
        pic_num = folds_size-1;
    }
    else{
        pic_num +=1 ;
    }

    ppt_hold.setAttribute('title',pic_num.toString());
    var url_path = $('#ppt_hold').css('background-image');
    var oppo_path = url_path.match('ppt_barrage/(.*?)"')[1];
    oppo_path = oppo_path.replace(/[0-9]\d*.jpg/,pic_num.toString() + '.jpg');
    var command = './' + oppo_path;
    command = 'url("' + command + '")';
    $('#ppt_hold').css('background-image',command);
    var input=document.getElementById("input");
    input.value=pic_num + 1;
}

        var path;
        var files_number;
        var obj_data;
        function ajaxTest(filename) {
            var data = {
            "filename": filename
            }
        $.ajax({
        type: 'POST',
        url: './api/info_file',
        async: false,
        data: data,
        dataType: 'json',
        success: function(data) {
            obj_data = data
        }
        });
        }
            var filename_and_number = {};
            var ppt_catalog_num = 1;
            var ppt_catalog_total ;
            var ppt_catalog = document.getElementById('a');
            var folds = {{ folds|safe }};
            if (folds.length%5==0){
                ppt_catalog_total = folds.length/5;
            }
            else{
                ppt_catalog_total = Math.floor(folds.length/5) + 1;
            }
            var ul_array = [];
            var result = [];
            for(var i=0,len=folds.length;i<len;i+=5){
                result.push(folds.slice(i,i+5));
            }
            for (var i = 0 ; i < result.length;i++){
                var div_list = document.createElement('div');
                for ( var j = 0 ; j < result[i].length;j++){
                    var the_p = document.createElement('button');
                    var text = document.createTextNode(result[i][j].toString());
                    ajaxTest(result[i][j].toString());
                    path = obj_data['path']
                    files_number = obj_data['number']
                    var file_name = obj_data['filename']
                    filename_and_number[file_name] = obj_data[file_name]
                    the_p.setAttribute('href',path);
                    the_p.setAttribute("style","width:100%;border:0;height:50px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap");
                    the_p.onclick = function (){
                        choosePPT(this);
                    };
                    the_p.appendChild(text);
                    div_list.appendChild(the_p);
                }
                ul_array.push(div_list);
            }
            ppt_catalog.appendChild(ul_array[1])

    </script>
    <script>

         function choosePPT(which) {
             var file_path = which.getAttribute('href');
             var splits = file_path.split('/');
             var filename = splits[splits.length-1];
             folds_size = filename_and_number[filename];
             var set_path = file_path.toString() + '/0.jpg';
             var command = 'url(' + set_path + ')';
             $('#ppt_hold').css('background-image',command);
             var ppt_hold = document.getElementById('ppt_hold');
             ppt_hold.setAttribute('title','0');
             $('#danmu_list').empty();
             ajaxShowDbBarrage();
             $('.total_page').html("/"+folds_size);
             var input=document.getElementById("input");
            input.value=1;
         }
         function showDbBarrage(barrage_text){
            var text = barrage_text;
            var color = document.getElementById('color').value;
            var position = document.getElementById('position').value;
            var time = $('#danmu').data("nowtime")+5;
            var size =document.getElementById('text_size').value;
            var text_obj='{ "text":"'+text+'","color":"'+color+'","size":"'+size+'","position":"'+position+'","time":'+time+'}';
            var text_obj='{ "text":"'+text+'","color":"'+color+'","size":"'+size+'","position":"'+position+'","time":'+time+',"isnew":""}';
            var new_obj=eval('('+text_obj+')');
            $('#danmu').danmu("add_danmu",new_obj);
         }

         function showBarrage() {
             $('#danmu_list').empty();
             ajaxShowDbBarrage();
         }

         function foldAdd() {
                if (ppt_catalog_num + 1 == ppt_catalog_total){
                    ppt_catalog_num = ppt_catalog_num;
                }
                else{
                    ppt_catalog_num += 1;
                }
                var a = document.getElementById('a');
                $('#a').empty();
                a.appendChild(ul_array[ppt_catalog_num]);
                var btn=document.getElementByTagName('button');

            }
            foldSub();
        function foldSub() {
            if (ppt_catalog_num - 1 < 0){
                ppt_catalog_num = ppt_catalog_num;
            }
            else{
                ppt_catalog_num -= 1;
            }
            var a = document.getElementById('a');
            $('#a').empty()
            a.appendChild(ul_array[ppt_catalog_num]);
        }