(function($){
	

	var imageContainer={
		width:0,
		height:1,
		ratio:function(){
			return this.width/this.height;
		}
	};
	var mask={
		container: null,
		width:0,
		ratio:1,
		height:function(){
			return this.width/this.ratio;
		},
		center:{
			x:0,
			y:0
		},

		draw:function(){
			$(".mask").remove();
			$("body").append(this.loadMasks());
		},
		move:function(x, y){
			this.center.x+=x;
			this.center.y+=y;
			this.draw();
		},
		scale:function(factor){
			this.width=this.width*factor;
			this.draw();
		},
		
		loadMasks:function(){
			var that=this;
			var topMask={
				top:function(){return 0},
				left:function(){return 0},
				width:function(){return that.container.width},
				height:function(){
					return Math.round(min(that.container.height-that.height(), max(0, that.center.y- that.height()/2)));
				},
				position:function(){
					return "top:"+this.top()+"px;left:"+this.left()+"px";
				},
				toHtml:function(){
					return that.constructMask(this.width(), this.height(), this.position());
				}

			};

			var bottomMask={
				top:function(){return that.height()+topMask.height()},
				left:function(){return 0},
				width:function(){return that.container.width},
				height:function(){
					return max(0, that.container.height-that.height()-topMask.height());
				},
				position:function(){
					return "top:"+this.top()+"px;left:"+this.left()+"px";
				},
				toHtml:function(){
					return that.constructMask(this.width(), this.height(), this.position());
				}
			};

			var leftMask={
				top:function(){return topMask.height()},
				left:function(){return 0},
				width:function(){
					return min(that.container.width-that.width, max(0, that.center.x-that.width/2));
				},
				height:function(){
					return max(0, that.container.height-topMask.height()-bottomMask.height());
				},
				position:function(){
					return "top:"+this.top()+"px;left:"+this.left()+"px";
				},
				toHtml:function(){
					return that.constructMask(this.width(), this.height(), this.position());
				}
			};

			var rightMask={
				top:function(){return topMask.height()},
				right:function(){return 0},
				width:function(){
					return max(0, that.container.width-that.width-leftMask.width());
				},
				height:function(){
					return leftMask.height();
				},
				position:function(){
					return "top:"+this.top()+"px;right:"+this.right()+"px";
				},
				toHtml:function(){
					return that.constructMask(this.width(), this.height(), this.position());
				}
			};

			return topMask.toHtml()+bottomMask.toHtml()+leftMask.toHtml()+rightMask.toHtml();
		},
		constructMask:function(w, h, position){
			return "<div class='mask' style='width:"+w+"px;height:"+h+"px;"+position+"'></div>"
		}




	};

	function max(value1,value2){
		if(value1>value2){
			return value1;
		}else{
			return value2;
		}
	}

	function min(value1,value2){
		if(value1>value2){
			return value2;
		}else{
			return value1;
		}

	}

	var confirmHandler=null;

	$("#imageContainer").attr("src",queryParameter("img"));
	$("#imageContainer").load(function(){
		init();
	});


	function init(){
		var image=$("#imageContainer");
		
		imageContainer.width=image.width();
		imageContainer.height=image.height();

		mask.width =imageContainer.width * 0.8;
		mask.ratio=imageContainer.ratio();
		mask.center.x=imageContainer.width/2;
		mask.center.y=imageContainer.height/2;
		mask.container=imageContainer;

		mask.draw();

		$(".selectButton").css("left",(imageContainer.width-$(".selectButton").width())/2+"px");
		$(".selectButton").css("top",(imageContainer.height-$(".selectButton").height())/2+"px");
		
		$(".selectButton").click(function(){
			hideConfirmBox();
			scanSelectedRegion();
		});

		$(".moduleMask").click(function(){
			hideConfirmBox();
		})

		var tracks=[];
		$("#imageContainer").on("touchmove", function (event) {
			if(typeof confirmHandler!="undefined" || confirmHandler!=null){
				clearTimeout(confirmHandler);
			}

			
			event.preventDefault();
			var touches=event.originalEvent.touches;
			if (touches.length === 1) { //move
				console.log(touches[0].pageX+", "+touches[0].pageY);
				tracks.push({pageX:touches[0].pageX, pageY:touches[0].pageY});
				move(tracks);
			}else if(touches.length === 2){ //pinch and zoom
				tracks.push({pageX:touches[0].pageX, pageY:touches[0].pageY});
				tracks.push({pageX:touches[1].pageX, pageY:touches[1].pageY});
				pinch(tracks);
			}

			confirmHandler=setTimeout(function(){
				showConfirmBox();
			}, 1500);


		}).on("touchstart", function () {
			tracks = [];
		}).on("touchend", function () {
			// move(tracks);
		});
	}

	function move(tracks){
		
		if(tracks.length == 2){
			var after=tracks.pop();
			var before=tracks.pop();
			
			var distance=calculateDistance(before, after);
			if(distance>2){
				var deltaX=after.pageX-before.pageX;
				var deltaY=after.pageY-before.pageY;
				mask.move(deltaX, deltaY);
			}
		}
	}

	function showConfirmBox(){
		$(".moduleMask").css("display","block");
	}
	function hideConfirmBox(){
		$(".moduleMask").css("display","none");
	}


	function queryParameter(key) {
		var match;

		key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&");
		match = location.search.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)"));
		return match && decodeURIComponent(match[1].replace(/\+/g, " "));
	}

	function pinch(tracks){
		if(tracks.length >=4){
			
			var new2=tracks.pop();
			var new1=tracks.pop();
			var old2=tracks.pop();
			var old1=tracks.pop();

			var oldDistance = calculateDistance(old1, old2);
			var newDistance = calculateDistance(new1, new2);

			var factor=newDistance/oldDistance;
			console.log("scale factor: "+ factor);	

			mask.scale(factor);
		}
	}

	function calculateDistance(after, before){
		var deltaX=after.pageX-before.pageX;
		var deltaY=after.pageY-before.pageY;
		console.log(deltaX+", "+deltaY);
		return Math.sqrt(deltaX*deltaX+deltaY*deltaY);
	}


	document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
		WeixinJSBridge.call('hideToolbar');
		WeixinJSBridge.call('hideOptionMenu');
	});

	function scanSelectedRegion(){
		var id=queryParameter("id");
		var x1=(mask.center.x-mask.width/2)/imageContainer.width;
		var x2=(mask.center.x+mask.width/2)/imageContainer.width;
		var y1=(mask.center.y-mask.height()/2)/imageContainer.height;
		var y2=(mask.center.y+mask.height()/2)/imageContainer.height;
		var url="http://receiptocr.sinaapp.com/src/corpimage.php?id="+id+"&x1="+x1+"&x2="+x2+"&y1="+y1+"&y2="+y2;

		$.get(url).done(function (data) {
            //alert(data);
            //todo: call ocr service api with data(image url) and id(image scan id)
        });
	}


})($);