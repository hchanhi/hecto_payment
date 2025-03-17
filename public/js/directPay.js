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
  }

  // 폼 데이터를 사용할 때
  const formElement = new DOMParser().parseFromString(formData, 'text/html').body.firstChild;

  document.body.appendChild(formElement);  // 폼을 body에 추가하여 화면에 보이지 않게 만듦
  formElement.submit();  // 폼 자동 제출
}


function initializeCodeMirror() {
codeMirrorInstance = CodeMirror.fromTextArea(document.getElementById("codeOutput"), {
  lineNumbers: true,
  mode: "htmlmixed",
  theme: "default",  
  readOnly: true,
  lineWrapping: false,
  matchTags: { bothTags: true }, // 태그 강조
  autoCloseTags: true, // 자동 태그 닫기
  autoCloseBrackets: true, // 자동 괄호 닫기
  foldGutter: true,  // 코드 접기 기능 활성화
  gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  extraKeys: { "Ctrl-Space": "autocomplete" }, // 자동완성 기능 (Ctrl + Space)
});
}



// updateCodeOutput에서 생성한 데이터를 저장할 변수
let formData = '';

function updateCodeOutput() {
  let LICENSE_KEY = document.getElementById("LICENSE_KEY").value;
  let AES256_KEY = document.getElementById("AES256_KEY").value;

  let hectoUrl = document.getElementById("hectoUrl").value;

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

  const formattedData = `
    <form action="${hectoUrl}" method="POST">
      <input type="hidden" name="mchtId" value="${mchtId}">
      <input type="hidden" name="method" value="${method}">
      <input type="hidden" name="trdDt" value="${trdDt}">
      <input type="hidden" name="trdTm" value="${trdTm}">
      <input type="hidden" name="mchtTrdNo" value="${mchtTrdNo}">
      <input type="hidden" name="mchtName" value="${mchtName}">
      <input type="hidden" name="mchtEName" value="${mchtEName}">
      <input type="hidden" name="pmtPrdtNm" value="${pmtPrdtNm}">
      <input type="hidden" name="trdAmt" value="${encryptAES256ECB(trdAmt, AES256_KEY)}">
      <input type="hidden" name="mchtCustNm" value="${encryptAES256ECB(mchtCustNm, AES256_KEY)}">
      <input type="hidden" name="notiUrl" value="${notiUrl}">
      <input type="hidden" name="nextUrl" value="${nextUrl}">
      <input type="hidden" name="cancUrl" value="${cancUrl}">
      <input type="hidden" name="mchtParam" value="${mchtParam}">
      <input type="hidden" name="email" value="${encryptAES256ECB(email, AES256_KEY)}">
      <input type="hidden" name="pktHash" value="${pktHash}">
      <button type="submit">결제창 호출</button>
    </form>
  `;

  const html =`<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>결제창 호출 테스트</title>
</head>
<body>
${formattedData}
</body>
</html>`;

  formData = formattedData;

  if (codeMirrorInstance) {
    codeMirrorInstance.setValue(html);
  }
}
