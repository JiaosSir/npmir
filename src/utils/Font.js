module.exports = class Font {
    static setMain(text, bold=true) {
        return bold 
            ? `\x1b[1;38;2;203;0;0m${ text }\x1b[0m` 
            : `\x1b[38;2;203;0;0m${ text }\x1b[0m` 
    }
    static setPrompt(text, bold=false) {
        return bold 
            ? `\x1b[1;38;2;255;210;210m${ text }\x1b[0m` 
            : `\x1b[38;2;255;210;210m${ text }\x1b[0m`
    }
    static setWarn(text, bold=false) {
        return bold 
            ? `\x1b[1;38;2;250;0;0m${ text }\x1b[0m`
            : `\x1b[38;2;250;0;0m${ text }\x1b[0m`
    }
    static setNote(text, bold=false) {
        return bold 
            ? `\x1b[1;38;2;229;164;75m${ text }\x1b[0m`
            : `\x1b[38;2;229;164;75m${ text }\x1b[0m`
    }
    static setStable(text, bold=false) {
        return bold 
            ? `\x1b[1;38;2;152;195;121m${ text }\x1b[0m`
            : `\x1b[38;2;152;195;121m${ text }\x1b[0m`
    }
}