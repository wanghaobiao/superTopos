<template>

    <div class="login-container" >
        <div class="card login-form">
            <el-form ref="form" :rules="rules" :model="form" label-width="80px" style="z-index: 10">
                <h2 class="login-title">CODE EDA SYSTEM</h2>
                <el-form-item label="用户名" prop="accountNumber" >
                    <el-input v-model="form.accountNumber"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="form.password"></el-input>
                </el-form-item>

                <el-form-item>
                    <button type="button" @click="submitForm('form')">
                        登录
                        <div class="arrow-wrapper">
                            <div class="arrow"></div>

                        </div>
                    </button>
                </el-form-item>
            </el-form>
        </div>
    </div>

</template>
<script>
export default {
    data() {
        return {
            form: {
                accountNumber: "",
                password: "",
            },
            rules: {
                accountNumber: [
                    { required: true, message: "用户名不能为空", trigger: "blur" },
                    { min: 3, max: 60, message: "用户名3-5位", trigger: "blur" },
                ],
                password: [
                    { required: true, message: "密码不能为空", trigger: "blur" },
                    { min: 3, max: 60, message: "密码3-5位", trigger: "blur" },
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
                        this.setCookie('accountNumber',result.accountNumber);
                        this.setCookie('accountName',result.accountName);
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
<style scoped>

.card {
    width: 400px;
    height: 400px;
    background: white;
    position: relative;
    display: flex;
    place-content: center;
    place-items: center;
    overflow: hidden;
    border-radius: 20px;
}

.card::before {

    content: '';
    position: absolute;
    width: 200px;
    background-image: linear-gradient(180deg, rgb(0, 183, 255), #4c63a4);
    height: 250%;
    animation: rotBGimg 3s linear infinite;
    transition: all 0.4s linear;
}

@keyframes rotBGimg {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.card::after {
    content: '';
    position: absolute;
    background: #4c63a4;
    inset: 10px;
    border-radius: 15px;
}
/*.card:hover:before {
    background-image: linear-gradient(220deg, rgb(81, 255, 0), purple);
    animation: rotBGimg 3.5s linear infinite;
}*/


.login-form {
    z-index: 100;
    width: 1000px;
    margin: 250px auto; /* 上下间距160px，左右自动居中*/
    background-color: rgb(255, 255, 255, 0.8); /* 透明背景色 */
    padding: 30px;
    border-radius: 20px; /* 圆角 */
}

/* 背景 */
.login-container {
    position: absolute;
    /*
     background: url("./../../../../src/assets/login-bg.jpg"); */
    /*background-image: url("./../../../../src/assets/login-bg.jpg");*/
    background-color: #2a559a;
    background-size: 100%;
    width: calc(100% - 0px);
    height: calc(100% - 0px);
    /* background-color: #545c64; */
}

/* 标题 */
.login-title {
    margin-bottom: 12px;
    z-index: 10;
    color: white;
    text-align: center;
}

button {
    --primary-color: rgb(0, 183, 255);
    --secondary-color: #fff;
    --hover-color: rgb(236, 45, 236);
    --arrow-width: 40px;
    --arrow-stroke: 2px;
    box-sizing: border-box;
    border: 0;
    border-radius: 20px;
    color: var(--secondary-color);
    padding: 1em 1.8em;
    background: var(--primary-color);
    display: flex;
    transition: 0.2s background;
    align-items: center;
    gap: 0.6em;
    font-weight: bold;
}
button .arrow-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}
.el-input .el-input__inner {
    background-color: #e8f0fe;
    border-color: #C0C4CC;
    color: #C0C4CC;
    cursor: not-allowed;
}

button .arrow {
    margin-top: 1px;
    width: var(--arrow-width);
    background: var(--primary-color);
    height: var(--arrow-stroke);
    position: relative;
    transition: 0.2s;
}

button .arrow::before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    border: solid var(--secondary-color);
    border-width: 0 var(--arrow-stroke) var(--arrow-stroke) 0;
    display: inline-block;
    top: -3px;
    right: 3px;
    transition: 0.2s;
    padding: 3px;
    transform: rotate(-45deg);
}

button:hover {
    background-color: var(--hover-color);
}

button:hover .arrow {
    background: var(--secondary-color);
}

button:hover .arrow:before {
    right: 0;
}
.el-button {
    border: 0px solid;
}
</style>
