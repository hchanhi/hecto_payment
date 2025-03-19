function populateData() {
    const params = new URLSearchParams(window.location.search);
    const list = document.getElementById("data-list");
    params.forEach((value, key) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${key}:</strong> ${value}`;
      list.appendChild(li);
    });
  }
  window.onload = populateData;


function closeOrRedirect() {
    if (window.opener) {
        window.opener.location.reload(); // 부모창 새로고침
        window.close(); // 팝업 창을 닫기
    } else {
      window.location.href = "/"; // 메인 페이지로 이동
    }
  }

window.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  const text = container.textContent;

  const textLength = text.length;
    console.log(textLength)
  container.style.width = `${textLength * 8}px`;
});
