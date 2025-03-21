let LICENSE_KEY;
let AES256_KEY;

window.onload = function() {
    LICENSE_KEY = document.getElementById("LICENSE_KEY").value;
    AES256_KEY = document.getElementById("AES256_KEY").value;
  
    const { trdDt } = getCurrentDateTime();
    const { trdTm } = getCurrentDateTime();
    const mchtTrdNo = `ORDER${trdDt}${trdTm}`;
    const requestData = "";

    initializeCodeMirror(); // CodeMirror 초기화
    ApiRequest();

    document.getElementById("mchtTrdNo").value = mchtTrdNo;
    document.addEventListener("input", ApiRequest);
    document.addEventListener("change", ApiRequest);
  
  };
  function getCurrentDateTime() {
    const now = new Date();
    const trdDt = now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
    const trdTm = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');
    return { trdDt, trdTm };
  }

  function generatePktHashCnl(
    trdDt,
    trdTm,
    mchtId,
    mchtTrdNo,
    trdAmt,
    LICENSE_KEY
  ) {
    if (!LICENSE_KEY) {
      console.error("License key is missing!");
      return null;
    }
    const rawData = `${trdDt}${trdTm}${mchtId}${mchtTrdNo}${trdAmt}${LICENSE_KEY}`;
    return CryptoJS.SHA256(rawData).toString(CryptoJS.enc.Hex);
  }

  function encryptAES256ECB(plainText, AES256_KEY) {
    if (!AES256_KEY) {
      console.error("Encryption key is missing!");
      return null;
    }
    const key = CryptoJS.enc.Utf8.parse(AES256_KEY);
    return CryptoJS.AES.encrypt(plainText, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
  }

  function ApiRequest() {
        LICENSE_KEY = document.getElementById("LICENSE_KEY").value;
        AES256_KEY = document.getElementById("AES256_KEY").value;
      
        const { trdDt, trdTm } = getCurrentDateTime();
        const mchtId = document.getElementById("mchtId").value;
        const mchtTrdNo = document.getElementById("mchtTrdNo").value;
        const method = document.getElementById("method").value;
        const mchtCustNm = document.getElementById("mchtCustNm").value;
        const mchtCustId = document.getElementById("mchtCustId").value;
        const cardNo = document.getElementById("cardNo").value;
        const vldDtMon = document.getElementById("vldDtMon").value;
        const idntNo = document.getElementById("idntNo").value;
        const cardPwd = document.getElementById("cardPwd").value;
        const instmtMon = document.getElementById("instmtMon").value;
        const crcCd = document.getElementById("crcCd").value;
        const trdAmt = document.getElementById("trdAmt").value;
        const pmtprdNm = document.getElementById("pmtprdNm").value;
        const hectorScriptUrl = document.getElementById("hectoScript").value;
        const now = new Date();
      
        const pktHashCnl = generatePktHashCnl(
          trdDt,
          trdTm,
          mchtId,
          mchtTrdNo,
          trdAmt,
          LICENSE_KEY
        );
      
        requestData = {
          params: {
            mchtId: mchtId,
            ver: "0A19",
            method: method,
            bizType: "B0",
            encCd: "23",
            mchtTrdNo: mchtTrdNo,
            trdDt: trdDt,
            trdTm: trdTm,
            mobileYn: "N",
            osType: "W",
          },
          data: {
            pktHash: pktHashCnl,
            crcCd: "KRW",
            pmtprdNm : pmtprdNm,
            mchtCustNm  :  mchtCustNm,
            mchtCustId: mchtCustId,
            cardNo : encryptAES256ECB(cardNo, AES256_KEY),
            vldDtMon : encryptAES256ECB(vldDtMon, AES256_KEY), 
            idntNo : encryptAES256ECB(idntNo, AES256_KEY),
            cardPwd : encryptAES256ECB(cardPwd, AES256_KEY),
            instmtMon : encryptAES256ECB(instmtMon, AES256_KEY),
            crcCd : crcCd,
            trdAmt : encryptAES256ECB(trdAmt, AES256_KEY)
          },
        };

        // CURL 명령어 생성
        const curlCommand = 
        `curl --requset POST \ /
      --url "${hectorScriptUrl}" \ /
      --header "Content-Type: application/json; charset=UTF-8" \ /
      --header "Accept: application/json" \ /
      --data '${JSON.stringify(requestData)}'`;
            
        updateCurlOutput(curlCommand);
    }

      function request() {
          // 서버로 요청 보내기
          $.ajax({
            url: '/api/send', // Node.js 서버로 요청
            type: 'POST',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify({
              requestData: requestData,
              hectorScriptUrl: $('#hectoScript').val(), // 선택된 연동 URL
            },
          ),
            success: function (response) {
              const responseData = JSON.stringify(response, null, 2);
              updateResOutput(responseData);
            },
            error: function (error) {
              console.error('서버 오류:', error);
              alert('취소 요청 전송 중 오류가 발생했습니다.');
            },
          });
      }

      function initializeCodeMirror() {
        codeMirrorReqInstance = CodeMirror.fromTextArea(document.getElementById("curlOutput"), {
          lineNumbers: true,
          mode: "shell",
          theme: "default",  
          lineWrapping: false, 
          scrollbarStyle: "native",
          readOnly: true,
          fontFamily: "'Noto Sans KR', sans-serif"
          
        });

        codeMirrorResInstance = CodeMirror.fromTextArea(document.getElementById("resOutput"), {
          lineNumbers: true,
          mode: "application/json",
          theme: "default",  
          lineWrapping: false, 
          scrollbarStyle: "native",
          readOnly: true,
          fontFamily: "'Noto Sans KR', sans-serif"
        });
        }


        function updateCurlOutput(data) {
          if (codeMirrorReqInstance) {
            codeMirrorReqInstance.setValue(data);
          }
        }

        function updateResOutput(data) {
          if (codeMirrorResInstance) {
            codeMirrorResInstance.setValue(data);
          }
        }
