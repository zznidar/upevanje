presetBox = document.getElementById("presetBox");
presetCreator = document.getElementById("presetCreator");

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
        where.insertAdjacentHTML("beforeend", `<option>${ime}</option>`);
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
    }
}

function refreshPresets() {
    presetBox.innerHTML = "<option>Create new ...</option>";
    listPresets(presetBox);
}