function tampilkanKisiKisi(bab){
const panel = document.getElementById("panel-kisi-kisi");

if(bab !== "STS" && bab !== "SAS"){
panel.style.display = "none";
return;
}

panel.innerHTML = `
<button onclick="togglePanelKisi()" style="
width:100%;
padding:12px;
border:none;
border-radius:8px;
background:#ffc107;
font-weight:800;
cursor:pointer;
margin-bottom:10px;">
📑 LIHAT / TUTUP KISI-KISI
</button>

<div id="isi-kisi-panel" style="
max-height:420px;
overflow-y:auto;
background:#fff;
padding:15px;
border-radius:8px;
border:1px solid #ddd;
line-height:1.7;">
${KISI_KISI_KELAS_1[bab]}
</div>
`;

panel.style.display = "block";
}

function togglePanelKisi(){
const isi = document.getElementById("isi-kisi-panel");
isi.style.display = (isi.style.display === "none") ? "block" : "none";
}
