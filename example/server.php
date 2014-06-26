<?php
require('../src/Wechat.php');
class MyWechat extends Wechat {

  protected function onSubscribe() {
    $currentUser = $this->getRequest('fromusername');
    updateStepName($currentUser, "query");
    $this->responseText("欢迎关注xxx！\n".$this->getHelpMessage());

  }

  protected function onUnsubscribe() {
  }

  protected function onText() {
    $currentUser = $this->getRequest('fromusername');
    $content = strtolower($this->getRequest('content'));
    $stepname=getStepName($currentUser);
    if($stepname=="imageuploaded"){
      if($content=="y"){
        updateStepName($currentUser, "na");
        $this->responseText('你的识别结果是：'. $currentUser);
      }else{
        $this->sendHelpTextMessage($currentUser); 
      }
    }else if($stepname=="query"){
      if(strtolower($content)=="m"){
        updateStepName($currentUser, "na");
        $this->responseText('你总共有3个药方识别结果。'. $currentUser);
      }else{
        $this->sendHelpTextMessage($currentUser); 
      }
    }else if($stepname=="na"){
      $this->sendHelpTextMessage($currentUser);  
    }
  }

  protected function onImage() {
    $currentUser = $this->getRequest('fromusername');
    $picUrl=$this->getRequest('picurl');
    $id=addOrginalImageUrl($currentUser, $picUrl);
    $items = array(
      new NewsResponseItem('药方OCR识别', '点击进入识别区域选择， 或者回复Y直接获取智能识别结果。', 
        $this->getRequest('picurl'), 
        'http://receiptocr.sinaapp.com/view/chooseregion.html?img='.$picUrl.'&id='.$id)
      );
    updateStepName($currentUser, "imageuploaded");

    $this->responseNews($items);
  }

  protected function sendHelpTextMessage($currentUser){
   updateStepName($currentUser, "query");
   $this->responseText($this->getHelpMessage());

 }

 protected function getHelpMessage(){
  return "直接发送图片进行药方智能识别，或者回复M查看个人药方信息。";
}

protected function onUnknown() {
  $currentUser = $this->getRequest('fromusername');
  updateStepName($currentUser, "query");
  $this->responseText("直接发送图片进行药方智能识别，或者回复M查看个人药方信息。");
}
}



function getStepName($userid){
 $mysql = new SaeMysql();
 $result=$mysql->getData("select `currentstep` FROM `workflow` where `userid`='".$userid."'");

 $stepname="";
 if(count($result)==1){
  $stepname=$result[0]['currentstep'];
}

return $stepname;
}

function addOrginalImageUrl($userid, $orignalUrl){
  $mysql = new SaeMysql();
  $sql = "insert into `image` (`userid`, `orginalurl`) VALUES ('".$userid."','".$orignalUrl."')";
  $mysql->runSql( $sql );
  
  $result=$mysql->getData("select `id` FROM `image` where `userid`='".$userid."' order by `id` desc limit 1");
  $id=0;
  if(count($result)==1){
    $id=$result[0]['id'];
  }

  return $id;

}

function updateStepName($userid, $stepname){
  $mysql = new SaeMysql();
  $insertSql = "insert into `workflow` (`userid`, `currentstep`) VALUES ('".$userid."','".$stepname."')";
  $updateSql = "update `workflow` set `currentstep`= '".$stepname."' where `userid`='".$userid."'"; 

  $result=$mysql->getData("select `currentstep` FROM `workflow` where `userid`='".$userid."'");
  $sql = $updateSql;
  if(count($result)==0){
    $sql = $insertSql;
  }

  $mysql->runSql( $sql );
}

function test(){
  updateCorpedImageUrl(1,"http://corpimage");
}
//test();

$wechat = new MyWechat('weixin', TRUE);
$wechat->run();
