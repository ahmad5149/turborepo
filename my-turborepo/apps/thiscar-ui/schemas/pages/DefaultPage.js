export default {
  title: '404 Page',
  name: 'defaultPage',
  type: 'document',
  __experimental_actions: ['update', 'create', 'delete', 'publish'],
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },

    {
      title: 'Upload an image for 404 page',
      name: 'image',
      type: 'image',
    },
    {
      title: 'Meta Data',
      name: 'metaData',
      type: 'pageMetaData',
    },
  ],
}
