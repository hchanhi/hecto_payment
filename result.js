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
