// 고정 확장자 로드
function loadFixedExt() {
  fetch("/api/fixed")
    .then((res) => res.json())
    .then((data) => {
      const box = document.getElementById("extFixed");
      box.innerHTML = "";

      data.forEach((item) => {
        const row = document.createElement("div");
        const check = document.createElement("input");
        check.type = "checkbox";
        check.value = item.ext;
        check.checked = item.blocked === 1;

        check.onchange = () => {
          fetch("/api/fixed", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json" 
            },
            body: JSON.stringify({
              ext: item.ext,
              blocked: check.checked
            }),
          });
        };

        row.appendChild(check);
        row.append(" " + item.ext);

        box.appendChild(row);
      });
    })
    .catch(err => {
      console.error("고정 확장자 로드 오류:", err);
    });
}

// 커스텀 확장자 목록 로드
function loadExtensions() {
  fetch("/api/extensions")
    .then((res) => res.json())
    .then((data) => {
      const ul = document.getElementById("extList");
      ul.innerHTML = "";

      const countText = `${data.length} / 200`;
      document.getElementById("extCount").textContent = countText;

      ul.style.display = "flex";
      ul.style.flexWrap = "wrap";
      ul.style.gap = "10px";
      ul.style.listStyle = "none";
      ul.style.padding = "0";

      data.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.ext + " ";

        const delBtn = document.createElement("button");
        delBtn.textContent = "X";
        delBtn.style.marginLeft = "8px";
        delBtn.onclick = () => deleteExt(item.ext);

        li.appendChild(delBtn);
        ul.appendChild(li);
      });
    })
    .catch(err => {
      console.error("목록 로드 실패:", err);
    });
}


// 커스텀 확장자 추가
function addExt() {
  const ext = document.getElementById("extInput").value.trim().toLowerCase();

  if (!ext) return alert("확장자를 입력하세요.");

  if (!/^[a-zA-Z0-9]+$/.test(ext)) {
    alert("확장자는 영어와 숫자만 입력할 수 있습니다.");
    return;
  }

  if (ext.length > 20) {
    alert("확장자는 20자 이하만 가능합니다.");
    return;
  }

  fetch("/api/extensions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ext })
  })
    .then((r) => r.json())
    .then((res) => {
      if (!res.ok) {
        alert(res.msg);   
        return;
      }

      document.getElementById("extInput").value = "";
      loadExtensions();
    })
    .catch(err => {
      console.error("추가 실패:", err);
    });
}

// 커스텀 확장자 삭제
function deleteExt(ext) {
  fetch(`/api/extensions/${ext}`, { 
    method: "DELETE" 
  })
  .then(loadExtensions)
  .catch(err => {
    console.error("삭제 오류:", err);
  });
}

// 파일 업로드 검사
function checkFile() {
  const file = document.getElementById("fileInput").files[0];
  
  if (!file) {
    alert("파일을 선택하세요.");
    return; 
  }

  const formData = new FormData();
  formData.append("file", file);

  fetch("/api/upload", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((result) => {
      document.getElementById("result").textContent = result.msg;
    })
    .catch(err => {
      console.error("파일 검사 오류:", err);
    });
}

document.getElementById("addBtn").onclick = addExt;
document.getElementById("checkBtn").onclick = checkFile;

loadFixedExt();
loadExtensions();
