window.onload = populateData;
function populateData() {
    const params = new URLSearchParams(window.location.search);
    const list = document.getElementById("data-list");
    params.forEach((value, key) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${key}:</strong> ${value}`;
      list.appendChild(li);
    });
      adjustContainerWidth();
  }

function adjustContainerWidth() {
  const container = document.querySelector(".container");
  
  if (container) {
    const textLength = container.textContent.length; // 텍스트 길이 계산
    console.log(`텍스트 길이: ${textLength}`);
    container.style.width = `${textLength * 8}px`; // 글자당 픽셀 수 곱하기
  }
}

function closeOrRedirect() {
    if (window.opener) {
        window.opener.location.reload(); // 부모창 새로고침
        window.close(); // 팝업 창을 닫기
    } else {
      window.location.href = "/"; // 메인 페이지로 이동
    }
  }
