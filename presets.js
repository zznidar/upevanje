presetBox = document.getElementById("presetBox");
// presetCreator = document.getElementById("presetCreator");

const SAVENAME = "upevanje_shranjene-vaje";

// First, we test if there are already any presets saved.
const st = localStorage;
data = new Map(JSON.parse(st.getItem(SAVENAME))); // We use maps to maintain order
if (data.size) {
    // Show a list of presets for the user to pick from
    listPresets(presetBox);
}

function savePreset(name, d) {
    if(data.has(name)) {
        let proceed = confirm("Vaja s tem imenom že obstaja. Jo želite prepisati?");
        if(!proceed) return(`Shranjevanje je bilo preklicano; vaja ${name} že obstaja.`);
        d["created"] = data.get(name)["created"];
    } else {
        d["created"] = (new Date).toISOString();
    }
    d["modified"] = (new Date).toISOString();
    data.set(name, d);
    st.setItem(SAVENAME, JSON.stringify([...data]));
    refreshPresets()
    return(`Successfully saved preset ${name}.`);
}

function removePreset(preset) {
    let status = data.delete(preset);
    st.setItem(SAVENAME, JSON.stringify([...data]));
    refreshPresets()
    return(status ? `Successfully removed preset ${name}.` : `Preset ${name} did not exist.`);
}

function listPresets(where) {
    for(let [ime, d] of data) {
        console.log(ime, d);
        let o = document.createElement("option");
        o.value = ime;
        o.innerText = ime;
        where.appendChild(o);
    }
}

function applyPreset(preset) {
    // Set preset values to textboxes
    // Automatically confirm settings
    if(data.has(preset)) {
        // Apply preset
        d = data.get(preset);
        console.log(d);
        devalueify(d);
    } else {
        // User wants to create new preset; show things visible.
        console.warn("Apparently, we don't have", preset);
    }
}

function refreshPresets() {
    presetBox.innerHTML = "<option>Create new ...</option>";
    listPresets(presetBox);
}

function exportPresets() {
    // Export presets to a file
    let file = new Blob([JSON.stringify([...data])], {type: "application/json"});
    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = `upevanje_${(new Date()).getTime()}.json`;
    a.click();
}

function importPresets(vsebina) {
    let overwrite = confirm("Ali želite obstoječe vaje z istim imenom prepisati?");

    let data2 = new Map(JSON.parse(vsebina));

    for(let [k, v] of data2) {
        if(!data.has(k) || overwrite) {
            v["imported"] = (new Date).toISOString();
            data.set(k, v);
        }
    }

    st.setItem(SAVENAME, JSON.stringify([...data]));
    refreshPresets();
}
