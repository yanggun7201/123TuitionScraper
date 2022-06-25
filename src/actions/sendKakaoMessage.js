const { KAKAO_FULL_SDK_JS_PATH } = require("../utils/constants");

async function loadKakaoScript(page) {
  await page.evaluate((jsPath) => {
    return new Promise(resolve => {
      const kakaoScript = document.createElement('script');
      kakaoScript.setAttribute('src', jsPath);
      kakaoScript.onload = resolve;
      document.head.appendChild(kakaoScript);
    })

  }, KAKAO_FULL_SDK_JS_PATH);
}

async function initKakaoAPI(page) {
  console.log('global.KAKAO_JAVASCRIPT_KEY', global.KAKAO_JAVASCRIPT_KEY);

  return await page.evaluate(async (kakaoJavascriptKey) => {
    await Kakao.init(kakaoJavascriptKey);

    return new Promise((resolve, reject) => {
      Kakao.Auth.login({
        success: function (auth) {
          console.log('auth', auth);
          resolve(true);
          // Kakao.API.request({
          //   url: '/v2/user/me',
          //   success: function(response){
          //     // 사용자 정보를 가져와서 폼에 추가.
          //     var account = response.kakao_account;
          //
          //     $('#form-kakao-login input[name=email]').val(account.email);
          //     $('#form-kakao-login input[name=name]').val(account.profile.nickname);
          //     $('#form-kakao-login input[name=img]').val(account.profile.img);
          //     // 사용자 정보가 포함된 폼을 서버로 제출한다.
          //     document.querySelector('#form-kakao-login').submit();
          //   },
          //   fail: function(error){
          //     // 경고창에 에러메시지 표시
          //     $('alert-kakao-login').removeClass("d-none").text("카카오 로그인 처리 중 오류가 발생했습니다.")
          //   }
          // }); // api request
        }, // success 결과.
        fail: function (error) {
          reject(error);
          // 경고창에 에러메시지 표시
          alert("login error" + JSON.stringify(error))
        }
      }); // 로그인 인증.
    });

    // return Kakao.isInitialized();
  }, global.KAKAO_JAVASCRIPT_KEY);
}

async function sendKakaoMessage(page, message) {
  await page.evaluate(async (message) => {
    Kakao.API.request({
      url: '/v2/api/talk/memo/default/send',
      data: {
        template_object: {
          object_type: 'text',
          text: message,
          link: {
            "web_url": "https://developers.kakao.com",
            "mobile_web_url": "https://developers.kakao.com"
          },
        },
      },
      success: function (response) {
        debugger;
        alert("success: " + response)
        console.log("success", response);
      },
      fail: function (error) {
        debugger;
        console.log("error", error);
        alert("error:" + error);
      },
    });
  }, message);
}

module.exports = {
  loadKakaoScript,
  initKakaoAPI,
  sendKakaoMessage,
}
