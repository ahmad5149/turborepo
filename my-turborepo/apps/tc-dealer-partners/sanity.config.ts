/**
 * This config is used to set up Sanity Studio that's mounted on the `/pages/studio/[[...index]].tsx` route
 */
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { schemaTypes } from './schemas'
import { appConfig } from './src/appConfig'

export default defineConfig({
  basePath: '/studio',
  name: 'default',
  title: 'thisCar-rebrand',
  projectId: appConfig.SANITY_PROJECT_ID,
  dataset: appConfig.SANITY_DATASET, 
  schema:{
    types: schemaTypes,
  },
  plugins: [
    deskTool()
    // deskTool({
    //   // `defaultDocumentNode` is responsible for adding a “Preview” tab to the document pane
    //   // You can add any React component to `S.view.component` and it will be rendered in the pane
    //   // and have access to content in the form in real-time.
    //   // It's part of the Studio's “Structure Builder API” and is documented here:
    //   // https://www.sanity.io/docs/structure-builder-reference
    //   defaultDocumentNode: (S, { schemaType }) => {
    //     return S.document().views([
    //       // Default form view
    //       S.view.form(),
    //       // Preview
    //       S.view.component(Iframe).options(iframeOptions).title('Preview'),
    //     ])
    //   },
    // }),
    // Add the "Open preview" action
    // previewUrl({
    //   base: '/api/draft',
    //   requiresSlug: ['post'],
    //   urlSecretId: previewSecretId,
    // }),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    // visionTool({ defaultApiVersion: '2021-08-31' }),
  ],
})
