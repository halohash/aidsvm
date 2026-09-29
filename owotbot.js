const bot = new OWOTjs.Client({
    world: "aidsvm",
    log: true
});

bot.on("chat", data => {
    console.log("OWOT CHAT:", data);

    const tessage = data.message;

   emulator.keyboard_send_text(tessage + "\n")
});
bot.player.quota.infinite = true
function wender() {
    emulator.screen_adapter.get_text_screen().forEach((name, index) => {
    bot.world.writeString(name, -1, -1, 0, 0, 0, index);
});
}
window.addEventListener("load",()=>{setInterval(wender,1000)})