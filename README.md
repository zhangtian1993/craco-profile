# craco-profile
基于craco的配置插件

## 使用
1. 安装依赖<br/>`yarn add craco-profile`<br/>或<br/>`npm i craco-profile`
2. 修改craco.confign.js文件，参考如下
    ```
    const CracoProfile = require('craco-profile');
   
    CracoProfile.setup();
    
    module.exports = {
      plugins: [
        {
          plugin: CracoProfile,
        },
        // ... other plugins
      ]
    };
    ```
3. 在项目根目录建立profile.js文件，参考如下
    ```
    module.exports = {
     DEV: {
       PUBLIC_URL: '',
       SERVER_URL: 'http://localhost:8080/api'
     },
     QA: {
       PUBLIC_URL: '/myproject',
       SERVER_URL: 'http://xxx.com/api'
     },
     PROD: {
       PUBLIC_URL: '/myproject',
       SERVER_URL: 'http://yyy.com/api'
     },
    };
    ```
5. 在前端js代码中可以使用`process.env.PROFILE.SERVER_URL`来访问
6. 编译时使用`yarn build --profile=QA`来指定配置名称
7. 开发时可以在项目根目录建立profile.local.js文件，格式与profile.js文件一致。profile.local.js会覆盖profile.js中的属性。注意：profile.local.js最好加到.gitignore中，这样多人协同开发可以自由控制自己想要的配置参数。
