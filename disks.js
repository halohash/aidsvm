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
        emulator.set_cdrom(new Uint8Array(buffer)); 
        console.log("CD successfully loaded!");
    })
    .catch(err => console.error("Failed to load CD:", err));};
async function statesave() {
    try {
        const stateBuffer = await emulator.save_state();
        return stateBuffer;
    } catch (error) {
        console.error("Failed to save emulator state:", error);
        throw error;
    }
}

async function getstate(statebuffer) {
    try {
        emulator.stop(); 
        
        await emulator.restore_state(statebuffer);
        
        emulator.run(); 
    } catch (error) {
        console.error("Failed to restore emulator state:", error);
        throw error;
    }
}


async function changestatebyte(index, newValue) {
  try {
    const stateBuffer = await emulator.save_state();
    
    const byteArray = new Uint8Array(stateBuffer);
    
    byteArray[index] = newValue; 
    
    getstate(stateBuffer);
  } catch (error) {
    console.error("Failed to change state byte:", error);
    throw error;
  }
}