const bot = new OWOTjs.Client({
    world: "aidsvm",
    log: true
});

const WHITELIST = [
    "the4gspeed"
];

const KEY_MAP = {
    a: ["a", "KeyA"],
    b: ["b", "KeyB"],
    c: ["c", "KeyC"],
    d: ["d", "KeyD"],
    e: ["e", "KeyE"],
    f: ["f", "KeyF"],
    g: ["g", "KeyG"],
    h: ["h", "KeyH"],
    i: ["i", "KeyI"],
    j: ["j", "KeyJ"],
    k: ["k", "KeyK"],
    l: ["l", "KeyL"],
    m: ["m", "KeyM"],
    n: ["n", "KeyN"],
    o: ["o", "KeyO"],
    p: ["p", "KeyP"],
    q: ["q", "KeyQ"],
    r: ["r", "KeyR"],
    s: ["s", "KeyS"],
    t: ["t", "KeyT"],
    u: ["u", "KeyU"],
    v: ["v", "KeyV"],
    w: ["w", "KeyW"],
    x: ["x", "KeyX"],
    y: ["y", "KeyY"],
    z: ["z", "KeyZ"],
    "0": ["0", "Digit0"],
    "1": ["1", "Digit1"],
    "2": ["2", "Digit2"],
    "3": ["3", "Digit3"],
    "4": ["4", "Digit4"],
    "5": ["5", "Digit5"],
    "6": ["6", "Digit6"],
    "7": ["7", "Digit7"],
    "8": ["8", "Digit8"],
    "9": ["9", "Digit9"],
    enter: ["Enter", "Enter"],
    space: [" ", "Space"],
    backspace: ["Backspace", "Backspace"],
    tab: ["Tab", "Tab"],
    escape: ["Escape", "Escape"],
    esc: ["Escape", "Escape"],
    shift: ["Shift", "ShiftLeft"],
    ctrl: ["Control", "ControlLeft"],
    control: ["Control", "ControlLeft"],
    alt: ["Alt", "AltLeft"],
    arrowup: ["ArrowUp", "ArrowUp"],
    up: ["ArrowUp", "ArrowUp"],
    arrowdown: ["ArrowDown", "ArrowDown"],
    down: ["ArrowDown", "ArrowDown"],
    arrowleft: ["ArrowLeft", "ArrowLeft"],
    left: ["ArrowLeft", "ArrowLeft"],
    arrowright: ["ArrowRight", "ArrowRight"],
    right: ["ArrowRight", "ArrowRight"],
    f1: ["F1", "F1"],
    f2: ["F2", "F2"],
    f3: ["F3", "F3"],
    f4: ["F4", "F4"],
    f5: ["F5", "F5"],
    f6: ["F6", "F6"],
    f7: ["F7", "F7"],
    f8: ["F8", "F8"],
    f9: ["F9", "F9"],
    f10: ["F10", "F10"],
    f11: ["F11", "F11"],
    f12: ["F12", "F12"]
};

function getCanvas() {
    return document.querySelector("#screen_container canvas");
}

function getKey(key) {
    const normalized = String(key).toLowerCase();

    if (KEY_MAP[normalized]) {
        return {
            key: KEY_MAP[normalized][0],
            code: KEY_MAP[normalized][1]
        };
    }

    if (String(key).length === 1) {
        return {
            key: String(key),
            code: ""
        };
    }

    return {
        key: String(key),
        code: String(key)
    };
}

function dispatchKeyboardEvent(type, key, code) {
    const event = new KeyboardEvent(type, {
        key: key,
        code: code,
        bubbles: true,
        cancelable: true,
        composed: true
    });

    const canvas = getCanvas();

    if (canvas) {
        canvas.dispatchEvent(event);
    }

    document.dispatchEvent(event);
    window.dispatchEvent(event);
}

function pressKey(key) {
    const mapped = getKey(key);

    console.log("Pressing key:", mapped.key, mapped.code);

    const canvas = getCanvas();

    if (canvas) {
        canvas.focus();
    }

    dispatchKeyboardEvent(
        "keydown",
        mapped.key,
        mapped.code
    );

    setTimeout(() => {
        dispatchKeyboardEvent(
            "keyup",
            mapped.key,
            mapped.code
        );
    }, 75);
}

function pressKeys(keys) {
    let delay = 0;

    for (const key of keys) {
        setTimeout(() => {
            pressKey(key);
        }, delay);

        delay += 100;
    }
}

function repeatKey(key, amount) {
    amount = Number(amount);

    if (!Number.isFinite(amount)) {
        return;
    }

    amount = Math.max(1, Math.min(amount, 100));

    let count = 0;

    const interval = setInterval(() => {
        pressKey(key);

        count++;

        if (count >= amount) {
            clearInterval(interval);
        }
    }, 100);
}

function sendText(content) {
    if (
        !window.emulator ||
        typeof window.emulator.keyboard_send_text !== "function"
    ) {
        console.log("emulator.keyboard_send_text is unavailable");
        return;
    }

    window.emulator.keyboard_send_text(`${content}\n`);
}

function getChatUsername(data) {
    return (
        data.username ||
        data.nickname ||
        data.name ||
        data.nick ||
        data.user ||
        data.player ||
        data.sender ||
        ""
    );
}

function getChatMessage(data) {
    return (
        data.message ||
        data.text ||
        data.msg ||
        data.content ||
        ""
    );
}

bot.on("open", () => {
    console.log("AIDSVMBot connected to OWOT");
});

bot.on("join", () => {
    bot.nickname = "AIDSVMBot";
    console.log("AIDSVMBot joined the world");
});

bot.on("chat", data => {
    console.log("OWOT CHAT:", data);

    const username = getChatUsername(data);
    const message = getChatMessage(data);

    if (!WHITELIST.includes(username)) {
        return;
    }

    if (!message) {
        return;
    }

    const trimmed = message.trim();

    if (trimmed.toLowerCase().startsWith("!sendtext ")) {
        const content = trimmed.substring(10);

        if (content) {
            sendText(content);
        }

        return;
    }

    const args = trimmed.split(/\s+/);

    if (!args.length) {
        return;
    }

    const command = args.shift().toLowerCase();

    if (command === "!key") {
        if (!args[0]) {
            return;
        }

        pressKey(args[0]);
        return;
    }

    if (command === "!keys") {
        if (!args.length) {
            return;
        }

        pressKeys(args);
        return;
    }

    if (command === "!repeat") {
        if (!args[0]) {
            return;
        }

        repeatKey(args[0], args[1] || 1);
        return;
    }
});

let lastScreen = null;

async function updateScreen() {
    try {
        if (!window.emulator) {
            return;
        }

        if (!emulator.screen_adapter) {
            return;
        }

        if (
            typeof emulator.screen_adapter.get_text_screen !==
            "function"
        ) {
            return;
        }

        const screentext =
            emulator.screen_adapter.get_text_screen();

        if (typeof screentext !== "string") {
            return;
        }

        if (screentext === lastScreen) {
            return;
        }

        lastScreen = screentext;

        await bot.world.writeString(
            screentext,
            "#000000",
            null,
            0,
            0,
            0,
            0
        );
    } catch (e) {
        console.error("Screen mirror error:", e);
    }
}

setInterval(updateScreen, 500);

function setupEmulator() {
    const canvas = getCanvas();

    if (!canvas) {
        setTimeout(setupEmulator, 500);
        return;
    }

    canvas.style.display = "block";
    canvas.tabIndex = 1;

    canvas.addEventListener("click", async () => {
        canvas.focus();

        if (!document.pointerLockElement) {
            try {
                await canvas.requestPointerLock();
            } catch (e) {
                console.error(e);
            }
        }
    });

    canvas.focus();

    console.log("Emulator canvas found");
}

setupEmulator();

console.log("AIDSVMBot loaded");
