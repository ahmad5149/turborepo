const offwhite = "#FAF9F6";
const grey = "#808080";
const black = "#000000";
const white = "#FAF9F6";
const red = "#FF0000";
const silver = "#C0C0C0";
const tan = "#D2B48C";
const blue = "#0000FF";
const beige = "#f5f5dc";
const ebony = "#9c9152";
const mediumearthgrey = "#BEBEBE";
const tupeloblack = "#9c9152";
const green = "#008000";
const brown = "#964B00";
const orange = "#FFA500";
const maroon = "#800000";
const gray = "#808080";
const yellow = "#FFFF00";
const purple = "#800080";
const gold = "#FFD700";
const copper = "#B87333";
const turquoise = "#40e0d0";

const ReturnColorCode = (obj, propName) => {
    const formattedPropName = propName.toLowerCase().replace(/\s/g, "").replace(/\//g, "");

    if (obj.hasOwnProperty(formattedPropName)) {
        return obj[formattedPropName];
    }
    return null;
};

export {
    yellow,
    purple,
    gold,
    copper,
    turquoise,
    maroon,
    gray,
    orange,
    brown,
    green,
    offwhite,
    grey,
    black,
    white,
    red,
    silver,
    tan,
    blue,
    beige,
    ebony,
    mediumearthgrey,
    tupeloblack,
    ReturnColorCode
};
