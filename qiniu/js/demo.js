let arrcontrol = document.getElementById("control").getElementsByTagName("div");
//提交房间和用户名的判断
function checkInput(inputval){
  let reg =  /^[a-zA-Z0-9_-]{3,64}$/; 
  return reg.test(inputval)
}
function joinRoomButton(defaultroomname){
  let roomname = document.getElementById("roomname")?document.getElementById("roomname").value:defaultroomname;
  let username = document.getElementById("username").value;
  console.log(roomname)
  if(checkInput(roomname) && checkInput(username)){
    creatRoomToken(roomname,username);
  }else{
    alert("请按照要求填写用户名和房间名！(3~64数字字母下划线)");
    return false;
  }
}

function creatRoomToken(roomname, username){
  let AK = "pHNNSR0R31i4gHfG7ZhznPjdpfyXxrr7Y6702uog";
  let SK = "0J1v1pzo5DDK8bAVbYGTxAlWqIkTg2MGA21jH7PA";
  //初始化roomtoken  
  let roomAccess = {
    "appId": "e16nfe56c",
    "roomName": roomname,
    "userId": username,
    "expireAt": 1605064271, //设置到2020年
    "permission": "user"
  };
  // console.log(roomAccess)
  //setp2
  let roomAccessString = JSON.stringify(roomAccess); 
  //setp3
  let encodedRoomAccess = base64encode(utf16to8(roomAccessString));
  //console.log(encodedRoomAccess)
  // 4. 计算HMAC-SHA1签名，并对签名结果做URL安全的Base64编码
  let sign = CryptoJS.HmacSHA1(encodedRoomAccess, SK)
  //
  //console.log(sign)
  let encodedSign = sign.toString(CryptoJS.enc.Base64);
  // setp5. 将AccessKey与以上两者拼接得到房间鉴权
  let roomToken = AK + ":" + safe64(encodedSign) + ":" + encodedRoomAccess;
  // console.log(roomToken);
  joinRoom(roomToken);
  //正则验证输入信息
}
// 确认引入成功
console.log("current version", QNRTC.version);
// 这里采用的是 async/await 的异步方案，您也可以根据需要或者习惯替换成 Promise 的写法
async function joinRoom(roomtoken) {
  // console.log(typeOf token);
  // console.log(roomtoken)
  let content = document.getElementById("content");
  content.setAttribute('style', 'display: none');
  // let height = window.innerHeight;
  document.getElementById("video").setAttribute("style","display: block; height: 750px");
  document.body.setAttribute("style","background-color: black")
  // 初始化一个房间 Session 对象, 这里使用 Track 模式
  const myRoom = new QNRTC.TrackModeSession();
  // 这里替换成刚刚生成的 RoomToken
  console.log(roomtoken)
  await myRoom.joinRoomWithToken(roomtoken);
  console.log("joinRoom success!");
  //离开房间
  arrcontrol[1].onclick = function () {
    myRoom.leaveRoom();
  }
  await publish(myRoom);
  autoSubscribe(myRoom);
}

// 增加一个函数 publish，用于采集并发布自己的媒体流
// 这里的参数 myRoom 是指刚刚加入房间时初始化的 Session 对象
async function publish(myRoom) {
  // 我们打开了 3 个参数，即采集音频，采集视频，采集屏幕共享。
  // 这个函数会返回一个列表，列表中每一项就是一个音视频轨对象
  const localTracks = await QNRTC.deviceManager.getLocalTracks({
    audio:  { enabled: true, tag: "audio" },
    video:  { enabled: true, tag: "video" },
    // screen: { enabled: true, tag: "screen" },
  });
  console.log("my local tracks", localTracks);
  // 将刚刚的 Track 列表发布到房间中
  await myRoom.publish(localTracks);
  console.log("publish success!");

  // 获取页面上的一个元素作为播放画面的父元素
  const localElement = document.getElementById("localtracks");
  // 遍历本地采集的 Track 对象
  for (const localTrack of localTracks) {
    // 如果这是麦克风采集的音频 Track，我们就不播放它。
    if (localTrack.info.tag === "audio") continue;
    // 调用 Track 对象的 play 方法在这个元素下播放视频轨
    localTrack.play(localElement, true);
  }
  

  arrcontrol[0].onclick = function () {
    await myRoom.unpublish(localTracks.map(track => track.info.trackId));
  }
  // arrcontrol[0].onclick = function () {
  //   console.log()
  // }
}


// 这里的参数 myRoom 是指刚刚加入房间时初始化的 Session 对象, 同上
// trackInfoList 是一个 trackInfo 的列表，订阅支持多个 track 同时订阅。
async function subscribe(myRoom, trackInfoList) {
  // 通过传入 trackId 调用订阅方法发起订阅，成功会返回相应的 Track 对象，也就是远端的 Track 列表了
  const remoteTracks = await myRoom.subscribe(trackInfoList.map(info => info.trackId));

  // 选择页面上的一个元素作为父元素，播放远端的音视频轨
  const remoteElement = document.getElementById("remotetracks");
  // 遍历返回的远端 Track，调用 play 方法完成在页面上的播放
  for (const remoteTrack of remoteTracks) {
    remoteTrack.play(remoteElement);
  }
}

function autoSubscribe(myRoom) {
  const trackInfoList = myRoom.trackInfoList;
  console.log("room current trackInfo list", trackInfoList)

  // 调用我们刚刚编写的 subscribe 方法
  subscribe(myRoom, trackInfoList)
    .then(() => console.log("subscribe success!"))
    .catch(e => console.error("subscribe error", e));

  // 添加事件监听，当房间中出现新的 Track 时就会触发，参数是 trackInfo 列表
  myRoom.on("track-add", (trackInfoList) => {
    console.log("get track-add event!", trackInfoList);
    subscribe(myRoom, trackInfoList)
      .then(() => console.log("subscribe success!"))
      .catch(e => console.error("subscribe error", e));
  });
}