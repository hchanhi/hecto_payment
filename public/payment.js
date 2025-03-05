window.onload = function() {
    let LICENSE_KEY = document.getElementById("LICENSE_KEY").value;
    let AES256_KEY = document.getElementById("AES256_KEY").value;
  
    const { trdDt } = getCurrentDateTime();
    const { trdTm } = getCurrentDateTime();
  
    const mchtTrdNo = `ORDER${trdDt}${trdTm}`;
    const pktHash = generatePktHash(mchtId, method, mchtTrdNo, trdDt, trdTm, trdAmt, LICENSE_KEY);
  
    document.getElementById("trdDt").value = trdDt;
    document.getElementById("trdTm").value = trdTm;
    document.getElementById("mchtTrdNo").value = mchtTrdNo;
    document.getElementById("pktHash").value = pktHash;
  
    initializeCodeMirror(); // CodeMirror 초기화
    updateCodeOutput();

    document.addEventListener("input", updateCodeOutput);
    document.addEventListener("change", updateCodeOutput);
  };

  let requestPayData;

function getCurrentDateTime() {
  const now = new Date();
  const trdDt = now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
  const trdTm = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');
  return { trdDt, trdTm };
}

function encryptAES256ECB(plainText, AES256_KEY) {
  if (!AES256_KEY) {
    console.error("Encryption key is missing!");
    return null;
  }else if(!plainText){
    return null;
  }else{
    const key = CryptoJS.enc.Utf8.parse(AES256_KEY);
    return CryptoJS.AES.encrypt(plainText, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
  }
}

function generatePktHash(mchtId, method, mchtTrdNo, trdDt, trdTm, trdAmt, LICENSE_KEY) {
  if (!LICENSE_KEY) {
    console.error("License key is missing!");
    return null;
  }
  const rawData = `${mchtId}${method}${mchtTrdNo}${trdDt}${trdTm}${trdAmt}${LICENSE_KEY}`;
  return CryptoJS.SHA256(rawData).toString(CryptoJS.enc.Hex);
}

function validateForm() {
  let isValid = true;
  const requiredFields = document.querySelectorAll('input[required]');
  
  requiredFields.forEach(input => {

      const errorMessage = input.nextElementSibling;
      if (!input.value) {
      input.style.borderColor = 'red'; 
      errorMessage.style.display = 'inline';
      isValid = false;
      } else {
      input.style.borderColor = ''; 
      errorMessage.style.display = 'none';
      }
  });

  return isValid;
}

function requestPay() {
  if (!validateForm()) {
      return;
  }else{
      SETTLE_PG.pay(requestPayData, function (rsp) {
          console.log(rsp);
      });
  };
}


function initializeCodeMirror() {
codeMirrorInstance = CodeMirror.fromTextArea(document.getElementById("codeOutput"), {
  lineNumbers: true,
  mode: "javascript",
  theme: "default",  
  readOnly: true,
  lineWrapping: false,
});
}



function updateCodeOutput() {
  
let LICENSE_KEY = document.getElementById("LICENSE_KEY").value;
let AES256_KEY = document.getElementById("AES256_KEY").value;

  const hectoScript = document.getElementById("hectoScript").value;
  if (hectoScript){
    if (hectoScript.includes("tbnpg.settlebank.co.kr")) {
      env = "https://tbnpg.settlebank.co.kr"; // 테스트베드
    }else {
      env = "https://npg.settlebank.co.kr"; // 상용 환경
    }
  }

  const mchtId = document.getElementById("mchtId").value;
  const method = document.getElementById("method").value;
  const trdDt = document.getElementById("trdDt").value;
  const trdTm = document.getElementById("trdTm").value;
  const mchtTrdNo = document.getElementById("mchtTrdNo").value;
  const mchtName = document.getElementById("mchtName").value;
  const mchtEName = document.getElementById("mchtEName").value;
  const pmtPrdtNm = document.getElementById("pmtPrdtNm").value;
  const trdAmt = document.getElementById("trdAmt").value;
  const notiUrl = document.getElementById("notiUrl").value;
  const nextUrl = document.getElementById("nextUrl").value;
  const mchtCustNm = document.getElementById("mchtCustNm").value;
  const cancUrl = document.getElementById("cancUrl").value;
  const mchtParam = document.getElementById("mchtParam").value;
  const cphoneNo = document.getElementById("cphoneNo").value;
  const email = document.getElementById("email").value;
  const pktHash = generatePktHash(mchtId, method, mchtTrdNo, trdDt, trdTm, trdAmt, LICENSE_KEY);
  const type = document.getElementById("type").value;

  document.getElementById("mchtTrdNo").value = mchtTrdNo;
  document.getElementById("pktHash").value = pktHash;


  requestPayData = {
    env: env,
    mchtId: mchtId,
    method: method,
    trdDt: trdDt,
    trdTm: trdTm,
    mchtTrdNo: mchtTrdNo,
    mchtName: mchtName,
    mchtEName: mchtEName,
    pmtPrdtNm: pmtPrdtNm,
    trdAmt: encryptAES256ECB(trdAmt, AES256_KEY),
    mchtCustNm: encryptAES256ECB(mchtCustNm, AES256_KEY),
    cphoneNo: encryptAES256ECB(cphoneNo, AES256_KEY),
    notiUrl: notiUrl,
    nextUrl: nextUrl,
    cancUrl: cancUrl,
    mchtParam : mchtParam,
    email: encryptAES256ECB(email, AES256_KEY),
    custIp: "1.1.1.1",
    pktHash: pktHash,
    ui: {
      type: type,
      width: "430",
      height: "660"
    }
  };

  for (const key in requestPayData) {
        if (requestPayData[key] === '' || requestPayData[key] === null) {
        delete requestPayData[key];
        }
    }

  let formattedData = JSON.stringify(requestPayData, null, 2);
  formattedData = formattedData.replace(/"(\w+)":/g, '    "$1":');

  const data =
`<!DOCTYPE html>
<html lang="ko">
<head>
<script type="text/javascript" src="https://code.jquery.com/jquery-1.12.4.min.js"></\script>
<script type="text/javascript" src="${hectoScript}"><\/script>
</head>

<body>

<button onclick="requestPay()">결제창 호출</button>

<script>
function requestPay() {
SETTLE_PG.pay(${formattedData});
}
<\/script>

<\/body>
<\/html>`;

  if (codeMirrorInstance) {
    codeMirrorInstance.setValue(data);
  }
}
