const Client = new OWOTjs.Client({
    world: "aidsvm",
    log: true
});

const WHITELIST = [
    "the4gspeed"
];

const KEY_MAP = {
    a: "KeyA",
    b: "KeyB",
    c: "KeyC",
    d: "KeyD",
    e: "KeyE",
    f: "KeyF",
    g: "KeyG",
    h: "KeyH",
    i: "KeyI",
    j: "KeyJ",
    k: "KeyK",
    l: "KeyL",
    m: "KeyM",
    n: "KeyN",
    o: "KeyO",
    p: "KeyP",
    q: "KeyQ",
    r: "KeyR",
    s: "KeyS",
    t: "KeyT",
    u: "KeyU",
    v: "KeyV",
    w: "KeyW",
    x: "KeyX",
    y: "KeyY",
    z: "KeyZ",
    "0": "Digit0",
    "1": "Digit1",
    "2": "Digit2",
    "3": "Digit3",
    "4": "Digit4",
    "5": "Digit5",
    "6": "Digit6",
    "7": "Digit7",
    "8": "Digit8",
    "9": "Digit9",
    enter: "Enter",
    space: "Space",
    backspace: "Backspace",
    tab: "Tab",
    escape: "Escape",
    esc: "Escape",
    shift: "ShiftLeft",
    ctrl: "ControlLeft",
    control: "ControlLeft",
    alt: "AltLeft",
    arrowup: "ArrowUp",
    up: "ArrowUp",
    arrowdown: "ArrowDown",
    down: "ArrowDown",
    arrowleft: "ArrowLeft",
    left: "ArrowLeft",
    arrowright: "ArrowRight",
    right: "ArrowRight",
    f1: "F1",
    f2: "F2",
    f3: "F3",
    f4: "F4",
    f5: "F5",
    f6: "F6",
    f7: "F7",
    f8: "F8",
    f9: "F9",
    f10: "F10",
    f11: "F11",
    f12: "F12"
};

function getCanvas() {
    return document.querySelector("#screen_container canvas");
}

function pressKey(key) {
    const canvas = getCanvas();
    if (!canvas) return;

    const normalized = key.toLowerCase();
    const code = KEY_MAP[normalized] || key;

    const keyName = normalized.length === 1
        ? normalized
        : ({
            Enter: "Enter",
            Space: " ",
            Backspace: "Backspace",
            Tab: "Tab",
            Escape: "Escape",
            ArrowUp: "ArrowUp",
            ArrowDown: "ArrowDown",
            ArrowLeft: "ArrowLeft",
            ArrowRight: "ArrowRight"
        }[code] || key);

    const down = new KeyboardEvent("keydown", {
        key: keyName,
        code: code,
        bubbles: true,
        cancelable: true
    });

    const up = new KeyboardEvent("keyup", {
        key: keyName,
        code: code,
        bubbles: true,
        cancelable: true
    });

    canvas.dispatchEvent(down);

    setTimeout(() => {
        canvas.dispatchEvent(up);
    }, 50);
}

function pressKeyRepeated(key, amount) {
    let count = 0;

    const interval = setInterval(() => {
        pressKey(key);
        count++;

        if (count >= amount) {
            clearInterval(interval);
        }
    }, 75);
}

Client.on("open", () => {
    console.log("OWOT bot connected");
});

Client.on("join", () => {
    Client.nickname = "AIDSVMBot";
    console.log("AIDSVMBot joined");
});

Client.on("chat", data => {
    const username =
        data.username ||
        data.nickname ||
        data.name ||
        "";

    const message =
        data.message ||
        data.text ||
        "";

    if (!WHITELIST.includes(username)) return;

    const args = message.trim().split(/\s+/);
    const command = args.shift().toLowerCase();

    if (command === "!key") {
        if (!args[0]) return;

        pressKey(args[0]);
        return;
    }

    if (command === "!keys") {
        if (!args.length) return;

        for (const key of args) {
            pressKey(key);
        }

        return;
    }

    if (command === "!repeat") {
        if (!args[0]) return;

        const key = args[0];
        const amount = Math.min(
            Math.max(parseInt(args[1] || "1", 10), 1),
            100
        );

        pressKeyRepeated(key, amount);
        return;
    }
});

let lastScreen = "";

async function updateScreen() {
    try {
        if (
            !window.emulator ||
            !emulator.screen_adapter ||
            typeof emulator.screen_adapter.get_text_screen !== "function"
        ) {
            return;
        }

        const screentext = emulator.screen_adapter.get_text_screen();

        if (typeof screentext !== "string") return;

        if (screentext === lastScreen) return;

        lastScreen = screentext;

        const newlinescreen = screentext;

        await Client.world.writeString(
            screentext,
            "#000000",
            null,
            -1,
            -1,
            0,
            newlinescreen
        );
    } catch (e) {
        console.error("Screen update error:", e);
    }
}

setInterval(updateScreen, 500);

setTimeout(() => {
    const canvas = document.querySelector("#screen_container canvas");
    if (!canvas) return;

    canvas.style.display = "block";

    canvas.addEventListener("click", async () => {
        if (!document.pointerLockElement) {
            try {
                await canvas.requestPointerLock();
            } catch (e) {
                console.error(e);
            }
        }
    });

    canvas.tabIndex = 1;
    canvas.focus();
}, 500);
