# qiniu-nodejs-angularjs-demo
qiniu/nodejs/angularjs demo [linux only].

## 使用

### 获取代码
```bash
#ngrok相关仅用于测试本地开发环境
#通过ngrok反向代理，使得七牛callback可以访问到本地端口

#获取代码
git clone git@github.com:zxdong262/qiniu-nodejs-demo.git
cd qiniu-nodejs-demo
cp config-sample.js config.js
cp start-ngrok-sample.sh start-ngrok.sh
npm install

#获取ngrok
wget https://dl.ngrok.com/ngrok_2.0.17_linux_amd64.zip
unzip ngrok_2.0.17_linux_amd64.zip

#先到ngrok.com注册并且登录，首页即显示token

#安装ngrok token
./ngrok authtoken 2FG2anNupD8cGxxxxgSk_4uhiSBmxxxx2K7u5P5Zwk

```

### 编辑 `start-ngrok.sh`
```bash
#!/bin/bash
#替换your-subdomain-name为 '你的ngrok_subdomain'
~/apps/ngrok http -subdomain=your-subdomain-name 4100

```


### 编辑 `config.js`
```javascript

//local setting
exports.local = {

    //端口
    port: 4100

    //环境
    ,env: 'dev'

    //cdn静态资源地址
    ,cdn: 'http://localhost:4100'
    
    //七牛设置 请编辑
    ,qiniu: {
        accessKey: '你的七牛accessKey'
        ,secretKey: '你的七牛secretKey'
        ,callbackUrl: '/qiniu-callback'
        ,domain: 'http://你的七牛domain.glb.clouddn.com'
        ,https: 'https://你的七牛https_url.qbox.me'

        //你的ngrok_subdomain 与 start-ngrok-local.sh的配置要一致
        //如果七牛可以访问你的callback地址或者说处于生产环境，请删除这个属性
        ,proxy: 'http://你的ngrok_subdomain.ngrok.io' 

        ,bucketName: '你的七牛空间名称'
    }

}

exports.setting = {

}
```


## 运行

```bash
#安装pm2
npm install pm2 -g

#运行ngrok
pm2 start start-ngrok-local.sh
#或者 ./start-ngrok-local.sh

#运行node程序
pm2 start dev-server.json
#或者 node --harmony app
```

访问 [http://localhost:4100](http://localhost:4100)

## License
MIT