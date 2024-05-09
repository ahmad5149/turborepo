const CheckLink = (linkText) => {
    let link = "#";
    if (linkText != null && linkText.trim() != "") {
        link = linkText;
    }
    return link;
};

export default CheckLink;
