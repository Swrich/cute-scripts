import zqzess from '../../utils/zqzess'

let $zqzess = zqzess()

let refresh_token_body = $zqzess.read('@ADrive.refresh_token_body')
if (refresh_token_body)
    refresh_token_body = JSON.parse(refresh_token_body)
let headers = $zqzess.read('@ADrive.headers')
if (headers)
    headers = JSON.parse(headers)
let refresh_token = $zqzess.read('@ADrive.refresh_token') // 备用
let authUrl = 'https://auth.aliyundrive.com/v2/account/token'
let checkInUrl = 'https://member.aliyundrive.com/v1/activity/sign_in_list'
let title = '🔔阿里云盘签到'

if ($zqzess.isRequest) {
    if ($request.method !== 'OPTIONS') {
        if ($request.url !== 'http://www.apple.com/') {
            console.log('🤖获取cookie')
            GetRefresh_token()
        } else {
            console.log('🤖签到操作')
            if (refresh_token_body && headers)
            {
                getAuthorizationKey()
            }
            else {
                $zqzess.notify(title, '❌请先获取token', '')
                $zqzess.done()
            }
        }
    }
} else {
    console.log('🤖签到操作')
    if (refresh_token_body && headers)
    {
        getAuthorizationKey()
    }
    else {
        $zqzess.notify(title, '❌请先获取token', '')
        $zqzess.done()
    }
}

function GetRefresh_token() {
    let body = JSON.parse($request.body)
    let xcanary = $request.headers['x-canary']
    let authUA = $request.headers['user-agent']
    let xdeviceid = $request.headers['x-device-id']
    let cookies = $request.headers['cookie']
    let headers = {'x-canary': xcanary, 'user-agent': authUA, 'x-device-id': xdeviceid, 'cookie': cookies}
    let refresh_token2 = body.refresh_token
    console.log('refresh_token: ' + refresh_token2)
    if (refresh_token2) {
        if ($zqzess.read('@ADrive.refresh_token')) {
            if ($zqzess.read('@ADrive.refresh_token') !== refresh_token2) {
                let t = $zqzess.write(JSON.stringify(body), '@ADrive.refresh_token_body')
                let t2 = $zqzess.write(refresh_token2, '@ADrive.refresh_token')
                let t3 = $zqzess.write(JSON.stringify(headers), '@ADrive.headers')
                if (t && t2 && t3) {
                    $zqzess.notify('更新阿里网盘refresh_token成功 🎉', '', '')
                } else {
                    $zqzess.notify('更新阿里网盘refresh_token失败‼️', '', '')
                }
            }
        } else {
            let t = $zqzess.write(JSON.stringify(body), '@ADrive.refresh_token_body')
            let t2 = $zqzess.write(refresh_token2, '@ADrive.refresh_token')
            let t3 = $zqzess.write(JSON.stringify(headers), '@ADrive.headers')
            if (t && t2 && t3) {
                $zqzess.notify('首次写入阿里网盘refresh_token成功 🎉', '', '')
            } else {
                $zqzess.notify('首次写入阿里网盘refresh_token失败‼️', '', '')
            }
        }
    }
    $zqzess.done()
}

function getAuthorizationKey() {
    let option = {
        url: authUrl,
        headers: {
            'content-type': 'application/json',
            'accept': '*/*',
            'accept-language': 'zh-CN,zh-Hansq=0.9',
            'x-canary': headers['x-canary'],
            'x-device-id': headers['x-device-id'],
            'cookie': headers['cookie'],
            'user-agent': headers['user-agent']
        },
        body: JSON.stringify(refresh_token_body)
    }
    console.log('获取authorization')
    $zqzess.post(option, function (error, response, data) {
        if (error) {
            console.log('错误原因：' + error)
            $zqzess.notify(title, '❌签到失败', '刷新authorization失败')
            return $zqzess.done()
        } else {
            let body = JSON.parse(data)
            let refresh_token2 = body.refresh_token
            let accessKey = 'Bearer ' + body.access_token
            if (refresh_token2) {
                refresh_token_body.refresh_token = refresh_token2
                let t = $zqzess.write(JSON.stringify(refresh_token_body), '@ADrive.refresh_token_body')
                let t2 = $zqzess.write(refresh_token2, '@ADrive.refresh_token')
                if (t && t2) {
                    // $zqzess.notify('刷新阿里网盘refresh_token成功 🎉', '', '')
                    console.log('刷新阿里网盘refresh_token成功 🎉')
                } else {
                    $zqzess.notify('刷新阿里网盘refresh_token失败‼️', '', '')
                }
            }
            signCheckin(accessKey)
        }
    })
}

function signCheckin(authorization) {
    let date = new Date()
    let timeStamp = Date.parse(date)
    let xumt = 'defaultFY1_fyjs_not_loaded@@https://pages.aliyundrive.com/mobile-page/web/dailycheck.html@@' + timeStamp
    let url_fetch_sign = {
        url: checkInUrl,
        headers: {
            ':authority': 'member.aliyundrive.com',
            'content-type': 'application/json',
            'accept': 'application/json, text/plain, */*',
            'authorization': authorization,
            'x-canary': headers['x-canary'],
            'x-umt': xumt,
            'origin': 'https://pages.aliyundrive.com',
            'x-ua': xumt,
            'user-agent': headers['user-agent'],
            'referer': 'https://pages.aliyundrive.com/'
        },
        body: JSON.stringify({})
    }
    console.log('签到开始')
    $zqzess.post(url_fetch_sign, function (error, response, data) {
        if (error) {
            console.log('错误：' + error)
            $zqzess.notify(title, '❌签到失败', '无法签到，请手动签到')
            $zqzess.done()
        } else {
            let body = JSON.parse(data)
            if(body.message!==null)
                $zqzess.done()
            let signInCount = Number(body.result.signInCount)
            let isReward = body.result.isReward
            let stitle = '🎉' + body.result.title + ' 签到成功'
            let signInLogs = body.result.signInLogs
            console.log('签到天数: ' + signInCount)
            let reward = ''
            signInLogs.forEach(function (i) {
                if (Number(i.day) === signInCount) {
                    if(i.isReward)
                    {
                        reward = ' 第' + signInCount + '天奖励，' + i.reward.name + i.reward.description
                    }else
                    {
                        reward = "签到失败😵‍💫😵‍💫😵‍💫"
                    }
                }
            })
            console.log('签到奖励：' + reward)
            if (isReward) {
                $zqzess.notify(title, stitle, reward)
            } else {
                stitle = '⚠️今天已经签到过了'
                $zqzess.notify(title, stitle, reward)
            }
            console.log('签到完成')
            $zqzess.done()
        }
    })
}
