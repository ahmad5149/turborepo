import {defineCliConfig} from 'sanity/cli'
import { appConfig } from './src/appConfig';

export default defineCliConfig({
  api: {
    projectId: appConfig.SANITY_PROJECT_ID,
    dataset: appConfig.SANITY_DATASET
  }
})
