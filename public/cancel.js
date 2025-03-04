window.onload = function() {
    let LICENSE_KEY = document.getElementById("LICENSE_KEY").value;
    let AES256_KEY = document.getElementById("AES256_KEY").value;
  
    const { trdDt } = getCurrentDateTime();
    const { trdTm } = getCurrentDateTime();
    const mchtTrdNo = `ORDER${trdDt}${trdTm}`;

    initializeCodeMirror(); // CodeMirror 초기화
    document.getElementById("mchtTrdNo").value = mchtTrdNo;
  
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
    cnclAmt,
    LICENSE_KEY
  ) {
    if (!LICENSE_KEY) {
      console.error("License key is missing!");
      return null;
    }
    const rawData = `${trdDt}${trdTm}${mchtId}${mchtTrdNo}${cnclAmt}${LICENSE_KEY}`;
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

  function CancelRequest() {
        const { trdDt, trdTm } = getCurrentDateTime();
        const mchtId = document.getElementById("mchtId").value;
        const mchtTrdNo = document.getElementById("mchtTrdNo").value;
        const orgTrdNo = document.getElementById("orgTrdNo").value;
        const cnclAmt = document.getElementById("cnclAmt").value;
        const method = document.getElementById("method").value;
        const cnclRsn = document.getElementById("cnclRsn").value;
        const now = new Date();
      
        const pktHashCnl = generatePktHashCnl(
          trdDt,
          trdTm,
          mchtId,
          mchtTrdNo,
          cnclAmt,
          LICENSE_KEY
        );
      
        const requestData = {
          params: {
            mchtId: mchtId,
            ver: "0A19",
            method: method,
            bizType: "C0",
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
            orgTrdNo: orgTrdNo,
            cnclAmt: encryptAES256ECB(cnclAmt, AES256_KEY),
            cnclOrd: "001",
            cnclRsn: cnclRsn,
          },
        };
      
        // 서버로 요청 보내기
        $.ajax({
          url: '/api/sendCancel', // Node.js 서버로 요청
          type: 'POST',
          contentType: 'application/json; charset=UTF-8',
          data: JSON.stringify({
            requestData: requestData,
            hectorScriptUrl: $('#hectoScript').val(), // 선택된 연동 URL
          },
          updateCodeOutput(requestData)
        ),
          success: function (response) {
            const responseData = "응답데이터 =====> "+JSON.stringify(response, null, 2);
            updateCodeOutput(responseData);
            // alert('취소 요청이 성공적으로 전송되었습니다.');
          },
          error: function (error) {
            console.error('서버 오류:', error);
            alert('취소 요청 전송 중 오류가 발생했습니다.');
          },
        });
      }

      function initializeCodeMirror() {
        codeMirrorReqInstance = CodeMirror.fromTextArea(document.getElementById("codeOutputReq"), {
          lineNumbers: true,
          mode: "javascript",
          theme: "default",  
          readOnly: true,
          lineWrapping: true,
        });

        codeMirrorResInstance = CodeMirror.fromTextArea(document.getElementById("codeOutputRes"), {
          lineNumbers: true,
          mode: "javascript",
          theme: "default",  
          readOnly: true,
          lineWrapping: true,
        });
        }


        function updateCodeOutput(data) {
          if (typeof data === "string" || data instanceof String) {
            if (codeMirrorResInstance) {
              codeMirrorResInstance.setValue(data);
            }
          } else {
            data = "요청데이터 =====> " + JSON.stringify(data, null, 2);
            if (codeMirrorReqInstance) {
              codeMirrorReqInstance.setValue(data);
            }
          }
      }
