const Colors = {
    reset: "\x1b[0m",
    foreground: {
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m"
    }
};

function writeLogs(color: string, ...logs){
    let date = new Date(),
        time = date.toString().split(' ')[4];
    time = time + ":" + (date.getMilliseconds() + "0").slice(0, 3);
    console.log(`[${time}]`, color, `[Core]`, Colors.reset, ...logs);
}

export default function(...logs){ writeLogs(Colors.foreground.magenta, ...logs); };
export function Info(...logs){ writeLogs(Colors.foreground.blue, ...logs); }
export function Success(...logs){ writeLogs(Colors.foreground.green, ...logs); }
export function Warn(...logs){ writeLogs(Colors.foreground.yellow, ...logs); }
export function Danger(...logs){ writeLogs(Colors.foreground.red, ...logs); }