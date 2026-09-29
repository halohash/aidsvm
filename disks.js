function floppyload(url) {fetch(url)
    .then(response => response.arrayBuffer())
    .then(buffer => {
        emulator.set_fdb(new Uint8Array(buffer)); 
        console.log("Floppy B (fdb) successfully loaded!");
    })
    .catch(err => console.error("Failed to load floppy image:", err));};
function cdload(url) {fetch(url)
    .then(response => response.arrayBuffer())
    .then(buffer => {
        emulator.set_fdb(new Uint8Array(buffer)); 
        console.log("CD successfully loaded!");
    })
    .catch(err => console.error("Failed to load CD:", err));};emulator.set_cdrom