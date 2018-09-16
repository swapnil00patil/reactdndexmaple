export const orderColors = {
    BO001: "#F6AE2D",
    BO002: "#55DDE0",
    BO003: "#33658A",
    BO004: "#2F4858",
    BO005: "#F26419",
    BO100: "#73937E",
    BR001: "#0CCE6B",
    BR002: "#541388",
    BR003: "#61210F",
    BR004: "#585563",
    BR005: "#5B2E48",
    BR006: "#ED7D3A",
    BR007: "#CEB992",
    BR008: "#4B644A",
    BR009: "#FFAFC5",
    BR010: "#9EBC9E",
    BR011: "#216869",
    BR012: "#49A078",
    BR013: "#B7999C",
    BR100: "#FFAFC5",
    SH001: "#EDAE49", 
    SH002: "#083D77",
    SH100: "#2364AA",
};

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}