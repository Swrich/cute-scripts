!function(){"use strict";let e=function(){const e=Date.now(),t="undefined"!=typeof $request,r="undefined"!=typeof $httpClient,n="undefined"!=typeof $task,o="undefined"!=typeof $loon,i="undefined"!=typeof $app&&"undefined"!=typeof $http,s="function"==typeof require&&!i,a="CookieSet.json",l=(()=>{if(s){return{request:require("request"),fs:require("fs"),path:require("path")}}return null})(),u=e=>(e&&(e.status?e.statusCode=e.status:e.statusCode&&(e.status=e.statusCode)),e),d=(e,t,r,n,o)=>("undefined"!=typeof merge&&t&&(merge[t].notify?merge[t].notify+=`\n${e}: 异常, 已输出日志 ‼️ (2)`:merge[t].notify=`${e}: 异常, 已输出日志 ‼️`,merge[t].error=1),console.log(`\n‼️${e}发生错误\n‼️名称: ${r.name}\n‼️描述: ${r.message}${JSON.stringify(r).match(/\'line\'/)?`\n‼️行列: ${JSON.stringify(r)}`:""}${n&&n.status?`\n‼️状态: ${n.status}`:""}${o?`\n‼️响应: ${n&&503!=n.status?o:"Omit."}`:""}`));return{AnError:d,isRequest:t,isJSBox:i,isSurge:r,isQuanX:n,isLoon:o,isNode:s,notify:(e,t,s,a)=>{const l=e=>{if(!e)return e;if("string"==typeof e)return o?e:n?{"open-url":e}:r?{url:e}:void 0;if("object"==typeof e){if(o){return{openUrl:e.openUrl||e.url||e["open-url"],mediaUrl:e.mediaUrl||e["media-url"]}}if(n){return{"open-url":e["open-url"]||e.url||e.openUrl,"media-url":e["media-url"]||e.mediaUrl}}if(r){return{url:e.url||e.openUrl||e["open-url"]}}}};console.log(`${e}\n${t}\n${s}`),n&&$notify(e,t,s,l(a)),r&&$notification.post(e,t,s,l(a)),i&&$push.schedule({title:e,body:t?t+"\n"+s:s})},write:(e,t)=>{if(n)return $prefs.setValueForKey(e,t);if(r)return $persistentStore.write(e,t);if(s)try{l.fs.existsSync(l.path.resolve(__dirname,a))||l.fs.writeFileSync(l.path.resolve(__dirname,a),JSON.stringify({}));const r=JSON.parse(l.fs.readFileSync(l.path.resolve(__dirname,a)));return e&&(r[t]=e),e||delete r[t],l.fs.writeFileSync(l.path.resolve(__dirname,a),JSON.stringify(r))}catch(e){return d("Node.js持久化写入",null,e)}return i?e?$file.write({data:$data({string:e}),path:`shared://${t}.txt`}):$file.delete(`shared://${t}.txt`):void 0},read:e=>{if(n)return $prefs.valueForKey(e);if(r)return $persistentStore.read(e);if(s)try{if(!l.fs.existsSync(l.path.resolve(__dirname,a)))return null;return JSON.parse(l.fs.readFileSync(l.path.resolve(__dirname,a)))[e]}catch(e){return d("Node.js持久化读取",null,e)}return i?$file.exists(`shared://${e}.txt`)?$file.read(`shared://${e}.txt`).string:null:void 0},get:(e,t)=>{e.headers["User-Agent"]="JD4iPhone/167169 (iPhone iOS 13.4.1 Scale/3.00)",n&&("string"==typeof e&&(e={url:e}),e.method="GET",$task.fetch(e).then((e=>{t(null,u(e),e.body)}),(e=>t(e.error,null,null)))),r&&(e.headers["X-Surge-Skip-Scripting"]=!1,$httpClient.get(e,((e,r,n)=>{t(e,u(r),n)}))),s&&l.request(e,((e,r,n)=>{t(e,u(r),n)})),i&&("string"==typeof e&&(e={url:e}),e.header=e.headers,e.handler=function(e){let r=e.error;r&&(r=JSON.stringify(e.error));let n=e.data;"object"==typeof n&&(n=JSON.stringify(e.data)),t(r,u(e.response),n)},$http.get(e))},post:(e,t)=>{e.headers["User-Agent"]||e.headers["user-agent"]||(e.headers["User-Agent"]="JD4iPhone/167169 (iPhone iOS 13.4.1 Scale/3.00)"),e.body&&(e.headers["Content-Type"]||e.headers["content-type"]||(e.headers["Content-Type"]="application/x-www-form-urlencoded")),n&&("string"==typeof e&&(e={url:e}),e.method="POST",$task.fetch(e).then((e=>{t(null,u(e),e.body)}),(e=>t(e.error,null,null)))),r&&(e.headers["X-Surge-Skip-Scripting"]=!1,$httpClient.post(e,((e,r,n)=>{t(e,u(r),n)}))),s&&l.request.post(e,((e,r,n)=>{t(e,u(r),n)})),i&&("string"==typeof e&&(e={url:e}),e.header=e.headers,e.handler=function(e){let r=e.error;r&&(r=JSON.stringify(e.error));let n=e.data;"object"==typeof n&&(n=JSON.stringify(e.data)),t(r,u(e.response),n)},$http.post(e))},time:()=>{const t=((Date.now()-e)/1e3).toFixed(2);return console.log("\n签到用时: "+t+" 秒")},done:(e={})=>{if(n)return $done(e);r&&(t?$done(e):$done())}}}(),t=e.read("@ADrive.refresh_token_body");t&&(t=JSON.parse(t));let r=e.read("@ADrive.headers");r&&(r=JSON.parse(r)),e.read("@ADrive.refresh_token");let n="https://member.aliyundrive.com/v1/activity/sign_in_list",o="🔔阿里云盘签到";function i(){let i={url:"https://auth.aliyundrive.com/v2/account/token",headers:{"content-type":"application/json",accept:"*/*","accept-language":"zh-CN,zh-Hansq=0.9","x-canary":r["x-canary"],"x-device-id":r["x-device-id"],cookie:r.cookie,"user-agent":r["user-agent"]},body:JSON.stringify(t)};console.log("获取authorization"),e.post(i,(function(i,s,a){if(i)return console.log("错误原因："+i),e.notify(o,"❌签到失败","刷新authorization失败"),e.done();{let i=JSON.parse(a),s=i.refresh_token,l="Bearer "+i.access_token;if(s){t.refresh_token=s;let r=e.write(JSON.stringify(t),"@ADrive.refresh_token_body"),n=e.write(s,"@ADrive.refresh_token");r&&n?console.log("刷新阿里网盘refresh_token成功 🎉"):e.notify("刷新阿里网盘refresh_token失败‼️","","")}!function(t){let i=new Date,s="defaultFY1_fyjs_not_loaded@@https://pages.aliyundrive.com/mobile-page/web/dailycheck.html@@"+Date.parse(i),a={url:n,headers:{":authority":"member.aliyundrive.com","content-type":"application/json",accept:"application/json, text/plain, */*",authorization:t,"x-canary":r["x-canary"],"x-umt":s,origin:"https://pages.aliyundrive.com","x-ua":s,"user-agent":r["user-agent"],referer:"https://pages.aliyundrive.com/"},body:JSON.stringify({})};console.log("签到开始"),e.post(a,(function(t,r,n){if(t)console.log("错误："+t),e.notify(o,"❌签到失败","无法签到，请手动签到"),e.done();else{let t=JSON.parse(n);null!==t.message&&e.done();let r=Number(t.result.signInCount),i=t.result.isReward,s="🎉"+t.result.title+" 签到成功",a=t.result.signInLogs;console.log("签到天数: "+r);let l="";a.forEach((function(e){Number(e.day)===r&&(l=e.isReward?" 第"+r+"天奖励，"+e.reward.name+e.reward.description:"签到失败😵‍💫😵‍💫😵‍💫")})),console.log("签到奖励："+l),i||(s="⚠️今天已经签到过了"),e.notify(o,s,l),console.log("签到完成"),e.done()}}))}(l)}}))}e.isRequest?"OPTIONS"!==$request.method&&("http://www.apple.com/"!==$request.url?(console.log("🤖获取cookie"),function(){let t=JSON.parse($request.body),r=$request.headers["x-canary"],n=$request.headers["user-agent"],o=$request.headers["x-device-id"],i=$request.headers.cookie,s={"x-canary":r,"user-agent":n,"x-device-id":o,cookie:i},a=t.refresh_token;if(console.log("refresh_token: "+a),a)if(e.read("@ADrive.refresh_token")){if(e.read("@ADrive.refresh_token")!==a){let r=e.write(JSON.stringify(t),"@ADrive.refresh_token_body"),n=e.write(a,"@ADrive.refresh_token"),o=e.write(JSON.stringify(s),"@ADrive.headers");r&&n&&o?e.notify("更新阿里网盘refresh_token成功 🎉","",""):e.notify("更新阿里网盘refresh_token失败‼️","","")}}else{let r=e.write(JSON.stringify(t),"@ADrive.refresh_token_body"),n=e.write(a,"@ADrive.refresh_token"),o=e.write(JSON.stringify(s),"@ADrive.headers");r&&n&&o?e.notify("首次写入阿里网盘refresh_token成功 🎉","",""):e.notify("首次写入阿里网盘refresh_token失败‼️","","")}e.done()}()):(console.log("🤖签到操作"),t&&r?i():(e.notify(o,"❌请先获取token",""),e.done()))):(console.log("🤖签到操作"),t&&r?i():(e.notify(o,"❌请先获取token",""),e.done()))}();
