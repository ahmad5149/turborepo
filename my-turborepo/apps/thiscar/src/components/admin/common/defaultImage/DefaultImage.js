import { DefaultBaseImagePath } from "../../../../appConfig";

export function GetDefaultImagePath(defaultImage) {
    return `${DefaultBaseImagePath}${defaultImage}`;
}
