var http = require('http');
var querystring = require('querystring');
var fs = require('fs');
var path = require('path');

var reqBody = {
	'qzreferrer':'http://cn.qzs.qq.com/qzone/msgboard/msgbcanvas.html#page=1',
	'content' : '',
	'hostUin' : '',
	'uin' : '',
	'format' : 'fs',
	'inCharset' : 'utf-8',
	'outCharset' : 'utf-8',
	'iNotice' : '1',
	'ref' : 'qzone',
	'json' : '1',
	'g_tk' : ''
};
var postData;

var options = {
	host : 'm.qzone.qq.com',
	port : 80,
	path: '/cgi-bin/new/add_msgb?g_tk=',//240547158
	method : 'POST',
	headers:{
		'Accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'Accept-Encoding' : 'gzip, deflate',
		'Accept-Language' : 'zh-CN,zh;q=0.8',
		'Cache-Control' : 'max-age=0',
		'Connection':'keep-alive',
		'Content-Length': '',
		'Content-Type':'application/x-www-form-urlencoded',
		'Cookie':'',
		'Host':'m.qzone.qq.com',
		'Origin':'http://cn.qzs.qq.com',
		'Referer':'http://cn.qzs.qq.com/qzone/msgboard/msgbcanvas.html',
		'Upgrade-Insecure-Requests':'1',
		'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/48.0.2564.82 Chrome/48.0.2564.82 Safari/537.36'
	}
};

function postComment(){
	var req = http.request(options,function(res){
	/*	console.log('status: '+ res.statusCode);
		console.log('headers '+ JSON.stringify);*/

		res.on('data',function(chunk){
	/*		console.log(Buffer.isBuffer(chunk));
			console.log(typeof chunk);*/
		});

		res.on('end',function(){
		/*	console.log('ok');*/
		});

		res.on('error',function(e){
			console.log('Error'+ e.message);
		});
	});

	req.write(postData);
	req.end();
	console.log('ok');
}

function getGTK(str){
	var hash = 5381;
	for(var i=0,len=str.length;i<len;i++){
		hash += (hash<<5) + str.charAt(i).charCodeAt();
	}
	return hash & 0x7fffffff;
}

function change(){
	fs.readFile('config.json',{encoding:'utf-8'},function(err,data){
		if(err) throw err;
		var result=JSON.parse(data);

		reqBody.content = result.content;
		reqBody.hostUin = result.targetQQ;
		reqBody.uin = result.yourQQ;

		//提取p_Skey 并计算Gtk    string.split
		var myGtk = String(getGTK(result.cookie.split("p_skey=")[1].split(";")[0]));
		reqBody.g_tk = myGtk;

		postData = querystring.stringify(reqBody);

		options.path += myGtk;
		options.headers.Cookie = result.cookie;
		options.headers['Content-Length'] = postData.length;
		//console.log(reqBody);
		//console.log(options);
		console.log("change ok");
	});
}

//执行字符串拼接修改
change();



exports.postComment = postComment;
exports.change = change;
