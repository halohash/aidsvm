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

async function getstatebyte(index) {
  const stateBuffer = await emulator.save_state();
  return new Uint8Array(stateBuffer)[index];
}

async function downloadStateFile() {
    try {
        // 1. Await the state data
        const stateData = await statesave();

        // 2. Convert to string if it is an object/array
        const dataString = typeof stateData === 'string' ? stateData : JSON.stringify(stateData);

        // 3. Create a binary Blob
        const blob = new Blob([dataString], { type: 'application/octet-stream' });

        // 4. Create a temporary download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'state.bin'; // The name of your file

        // 5. Trigger the download and clean up
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Failed to download state:', error);
    }
}