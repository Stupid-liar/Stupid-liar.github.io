// 随机房间号
if (!location.hash) {
  location.hash = Math.floor(Math.random() * 0xFFFFFF).toString(16);
}
const roomHash = location.hash.substring(1);

// 添加自己的频道
const drone = new ScaleDrone('6IQvsduPePtAfxOJ');
// 设置房间名
const roomName = 'observable-' + roomHash;
const configuration = {
  iceServers: [{
    urls: 'stun:stun.l.google.com:19302'   // 使用谷歌的stun服务
  }]
};
let room;
let pc;


function onSuccess() {};
function onError(error) {
  console.error(error);
};

drone.on('open', error => {
  if (error) {
    return console.error(error);
  }
  room = drone.subscribe(roomName);
  room.on('open', error => {
    if (error) {
      onError(error);
    }
  });
  // 已经链接到房间后，就会收到一个 members 数组，代表房间里的成员
  // 这时候信令服务已经就绪
  room.on('members', members => {
    console.log('MEMBERS', members);
   
  // 如果你是第二个链接到房间的人，就会创建offer
  const isOfferer = members.length === 2; //判断进入房间的人数
    startWebRTC(isOfferer);
  });
});

// 发送消息
function sendMessage(message) {
  drone.publish({
    room: roomName,
    message
  });
}

function startWebRTC(isOfferer) {
  pc = new RTCPeerConnection(configuration);

  // 当本地ICE Agent需要通过信号服务器发送信息到其他端时
  // 会触发icecandidate事件回调
  pc.onicecandidate = event => {
    if (event.candidate) {
      sendMessage({'candidate': event.candidate});
    }
  };

  // 第二个用户进入创建sdp
  if (isOfferer) {
    pc.onnegotiationneeded = () => {
      pc.createOffer().then(localDescCreated).catch(onError);
    }
  }

  // 远程媒体流
  pc.ontrack = event => {
    const stream = event.streams[0];
    if (!remoteVideo.srcObject || remoteVideo.srcObject.id !== stream.id) {
      remoteVideo.srcObject = stream;
    }
  };
  //初始化本地媒体流
  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  }).then(stream => {
    // 获取本地媒体流
    localVideo.srcObject = stream;
    // 将本地媒体流发送出去
    stream.getTracks().forEach(track => pc.addTrack(track, stream));
  }, onError);

  // 从Scaledrone监听信令服务
  room.on('data', (message, client) => {
    // 不处理自己的信息
    if (client.id === drone.clientId) {
      return;
    }

    if (message.sdp) {
      // 设置远程sdp
      pc.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
        // 当接受到offer后接听
        if (pc.remoteDescription.type === 'offer') {
          pc.createAnswer().then(localDescCreated).catch(onError);
        }
      }, onError);
    } else if (message.candidate) {
      // 增加新的信令到本地连接中
      pc.addIceCandidate(
        new RTCIceCandidate(message.candidate), onSuccess, onError
      );
    }
  });
}

function localDescCreated(desc) {
  pc.setLocalDescription(
    desc,
    () => sendMessage({'sdp': pc.localDescription}),
    onError
  );
}
