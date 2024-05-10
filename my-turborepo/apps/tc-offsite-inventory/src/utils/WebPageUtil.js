import { appConfig } from "../appConfig";

function GetTabName(currentTab) {
  return `${currentTab} | ${appConfig.APPLICATION_NAME}`;
}

export { GetTabName };
