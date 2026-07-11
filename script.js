const scriptBox = document.getElementById("script");
const imagePicker = document.getElementById("imagePicker");
const gallery = document.getElementById("gallery");

const saveProjectBtn = document.getElementById("saveProject");
const loadProjectBtn = document.getElementById("loadProject");
const exportScriptBtn = document.getElementById("exportScript");
const loadFile = document.getElementById("loadFile");

let images = [];

// ---------- Image Upload ----------

imagePicker.addEventListener("change", () => {

    Array.from(imagePicker.files).forEach(file => {

        const reader = new FileReader();

        reader.onload = e => {

            const image = {
                name: file.name,
                data: e.target.result
            };

            images.push(image);

            addImageCard(image);

        };

        reader.readAsDataURL(file);

    });

});

// ---------- Gallery ----------

function addImageCard(image){

    const card = document.createElement("div");
    card.className = "image-card";

    const img = document.createElement("img");
    img.src = image.data;

    const name = document.createElement("div");
    name.className = "image-name";
    name.textContent = image.name;

    const remove = document.createElement("button");
    remove.textContent = "Remove";

    remove.style.marginTop = "8px";

    remove.onclick = () => {

        images = images.filter(i => i !== image);
        card.remove();

    };

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(remove);

    gallery.appendChild(card);

}

// ---------- Save Project ----------

saveProjectBtn.onclick = () => {

    const project = {

        version: 1,

        script: scriptBox.value,

        images: images

    };

    const blob = new Blob(
        [JSON.stringify(project, null, 2)],
        {type:"application/json"}
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "project.cui4m";

    link.click();

};

// ---------- Load Project ----------

loadProjectBtn.onclick = () => {

    loadFile.click();

};

loadFile.addEventListener("change", () => {

    const file = loadFile.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = e => {

        const project = JSON.parse(e.target.result);

        scriptBox.value = project.script || "";

        images = project.images || [];

        gallery.innerHTML = "";

        images.forEach(addImageCard);

    };

    reader.readAsText(file);

});

// ---------- Export Script ----------

exportScriptBtn.onclick = () => {

    const blob = new Blob(
        [scriptBox.value],
        {type:"text/plain"}
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "mosaic.txt";

    link.click();

};

// ---------- Autosave ----------

const saved = localStorage.getItem("cui4m_project");

if(saved){

    try{

        const project = JSON.parse(saved);

        scriptBox.value = project.script || "";

        images = project.images || [];

        images.forEach(addImageCard);

    }catch(e){}

}

function autoSave(){

    const project = {

        script: scriptBox.value,

        images: images

    };

    localStorage.setItem(
        "cui4m_project",
        JSON.stringify(project)
    );

}

scriptBox.addEventListener("input", autoSave);

setInterval(autoSave, 5000);

// ---------- Welcome ----------

console.log("CUI4M loaded successfully.");
