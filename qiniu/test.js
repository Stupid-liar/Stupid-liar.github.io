function check(){
  let roomname = document.getElementById("roomname").value;
  let username = document.getElementById("username").value;
  if(roomname && username){
    let roomAccess = {
      "appId": "e16nfe56c"
      "roomName": roomname,
      "userId": username,
      "expireAt": <ExpireAt>,
      "permission": "user"
    };
    let roomAccessString = json_to_string(roomAccess); 
    encodedRoomAccess = urlsafe_base64_encode(roomAccessString)
    // 2. 计算HMAC-SHA1签名，并对签名结果做URL安全的Base64编码
    sign = hmac_sha1(encodedRoomAccess, <SecretKey>)
    encodedSign = urlsafe_base64_encode(sign)
    // 3. 将AccessKey与以上两者拼接得到房间鉴权
    roomToken = "<AccessKey>" + ":" + encodedSign + ":" + encodedRoomAccess
  }else{
    alert("请输入用户名和房间名")
    return false
  }
}