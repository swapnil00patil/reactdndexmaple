export const orderColors = {
    BO001: getRandomColor(),
    BO002: getRandomColor(),
    BO003: getRandomColor(),
    BO004: getRandomColor(),
    BO005: getRandomColor(),
    BR001: getRandomColor(),
    BR002: getRandomColor(),
    BR003: getRandomColor(),
    SH001: getRandomColor(),
    SH002: getRandomColor(),
    SH003: getRandomColor(),
};

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}