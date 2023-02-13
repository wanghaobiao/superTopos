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
                    <button  type="button" class="cssbuttons-io-button" @click="submitForm('form')">
                        <div class="icon">
                            <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path></svg>
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
        window.addEventListener('keydown', this.keyDown)
    },
    destroyed () {
        window.removeEventListener('keydown', this.keyDown, false)
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
        keyDown(e) {
            debugger
            if(e.keyCode === 13) {
                this.submitForm('form')
            }
        }
    },
};
</script>

<style scoped>
body {
    background-color: rgb(0, 183, 255);
}

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
    background-image: linear-gradient(180deg, rgb(0, 183, 255), #ff0deb);
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

.cssbuttons-io-button {
    background-image: linear-gradient(to right, rgb(0, 183, 255), #ff0deb);
    color: white;
    font-family: inherit;
    padding-right: -15px;
    padding-left: 12em;
    font-size: 17px;
    font-weight: 500;
    border-radius: 0.9em;
    border: none;
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    box-shadow: inset 0 0 1.6em -0.6em #4c63a4;
    overflow: hidden;
    position: relative;
    height: 2.8em;
    padding-right: 3.3em;
}

.cssbuttons-io-button .icon {
    background: white;
    margin-left: 2em;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.2em;
    width: 2.2em;
    border-radius: 0.7em;
    box-shadow: 0.1em 0.1em 0.6em 0.2em rgb(0, 183, 255);
    right: 0.3em;
    transition: all 0.3s;
}

.cssbuttons-io-button:hover .icon {
    width: calc(100% - 0.6em);
}

.cssbuttons-io-button .icon svg {
    width: 1.1em;
    transition: transform 0.3s;
    color: rgb(0, 183, 255);
}

.cssbuttons-io-button:hover .icon svg {
    transform: translateX(0.1em);
}

.cssbuttons-io-button:active .icon {
    transform: scale(0.95);
}

.el-button {
    border: 0px solid;
}
</style>
<style>
.el-input .el-input__inner {
    background-color: rgb(255, 255, 255);
    border-color: #495e9b;
    color: #C0C4CC;
    cursor: not-allowed;
    border-radius: 0.9em;

}
</style>
