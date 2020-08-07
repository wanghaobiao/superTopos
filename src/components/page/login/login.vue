<template>
   <div class="login-container" >
      <el-form ref="form" :rules="rules" :model="form" label-width="80px" class="login-form">
         <h2 class="login-title">CODE EDA SYSTEM</h2>
         <el-form-item label="用户名" prop="accountNumber">
            <el-input v-model="form.accountNumber"></el-input>
         </el-form-item>
         <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="form.password"></el-input>
         </el-form-item>

         <el-form-item>
            <el-button type="primary" @click="submitForm('form')">登录</el-button>
         </el-form-item>
      </el-form>
   </div>
</template>
<script>
export default {
   data() {
      return {
         form: {
            accountNumber: "admin",
            password: "123456",
         },
         rules: {
            accountNumber: [
               { required: true, message: "用户名不能为空", trigger: "blur" },
               { min: 3, max: 10, message: "用户名3-5位", trigger: "blur" },
            ],
            password: [
               { required: true, message: "密码不能为空", trigger: "blur" },
               { min: 3, max: 10, message: "密码3-5位", trigger: "blur" },
            ],
         },
      };
   },
   mounted() {
        document.querySelector('body').setAttribute('style', ' margin: 0px;')
    },
   methods: {
      submitForm(formName) {
         this.$refs[formName].validate((valid) => {
            // console.log(valid) 验证通过为true，有一个不通过就是false
            if (valid) {
               // 使用 vue-router 路由到指定页面，该方式称之为编程式导航
                this.getHttp("/api/login?"+this.jsonToUrl(this.form)).then(result => {
                    this.setCookie('accountNumber',result);
                    console.log(JSON.stringify(this.getCookie('accountNumber')));
                    this.$router.push("/main");
                });
            } else {
               console.log("验证失败");
               return false;
            }
         });
      },
   },
};
</script>

  <style >
.login-form {
   width: 350px;
   margin: 160px auto; /* 上下间距160px，左右自动居中*/
   background-color: rgb(255, 255, 255, 0.8); /* 透明背景色 */
   padding: 30px;
   border-radius: 20px; /* 圆角 */
}

/* 背景 */
.login-container {
   position: absolute;
   /* 
    background: url("./../../../../src/assets/login-bg.jpg"); */
    background-image: url("./../../../../src/assets/login-bg.jpg");
    background-size: 100%;
    width: calc(100% - 0px);
    height: calc(100% - 0px);
   /* background-color: #545c64; */
}

/* 标题 */
.login-title {
   color: #303133;
   text-align: center;
}
</style>