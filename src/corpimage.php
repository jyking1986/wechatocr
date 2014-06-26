<?php 
function updateCorpedImageUrl($id, $corpUrl){
	$mysql = new SaeMysql();
	$sql = "update `image` set `corpurl`= '".$corpUrl."' where `id`='".$id."'"; 
	$mysql->runSql( $sql );
}

function getImageUrl($id){
	$mysql = new SaeMysql();
	$result=$mysql->getData("select `orginalurl` FROM `image` where `id`='".$id."'");

	$orginalurl="";
	if(count($result)==1){
		$orginalurl=$result[0]['orginalurl'];
	}

	return $orginalurl;
}

function corpImage($imageUrl, $x1, $y1, $x2, $y2){
	$f = new SaeFetchurl();
	$img_data = $f->fetch($imageUrl);
	$img = new SaeImage();
	$img->setData( $img_data );
	$img->crop($x1, $x2, $y1, $y2);
	return $img->exec();
}

function saveToStorage($data, $name){
	$stor = new SaeStorage();
	return $stor->write("resource", $name, $data);
}

function execute(){
	$id=$_GET["id"];
	$x1=$_GET["x1"];
	$x2=$_GET["x2"];
	$y1=$_GET["y1"];
	$y2=$_GET["y2"];
	$url=getImageUrl($id);
	$data=corpImage($url, $x1, $y1, $x2, $y2);
	$coprurl=saveToStorage($data, 'corp/image'.$id.'.jpg');
	updateCorpedImageUrl($id, $coprurl);

	echo $coprurl;
}

execute();

//http://receiptocr.sinaapp.com/src/corpimage.php?id=4&x1=0.25&x2=0.75&y1=0.25&y2=0.75
function test(){
	$url=getImageUrl(4);
	$data=corpImage($url, 0.25,0.25,0.75,0.75);
	$coprurl=saveToStorage($data, 'corp/image'.$id.'.jpg');
	updateCorpedImageUrl($id, $coprurl);
}

function testCorpImage(){
	$imageUrl=getImageUrl(4);
	$f = new SaeFetchurl();
	$img_data = $f->fetch($imageUrl);
	$img = new SaeImage();
	$img->setData( $img_data );
	$img->crop(0.25,1,0.75,1);
	$img->exec('jpg', true);
}

// testCorpImage();


?>