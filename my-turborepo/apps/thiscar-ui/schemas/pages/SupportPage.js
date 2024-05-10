export default {
  title: 'Support Page',
  name: 'supportPage',
  type: 'document',
  __experimental_actions: ['update', /* 'create', 'delete', */ 'publish'],
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },

    {
      title: 'Question Section',
      name: 'questionSection',
      type: 'questionSection',
    },
    {
      title: 'Chat Section',
      name: 'chatSection',
      type: 'chatSection',
    },
    {
      title: 'Meta Data',
      name: 'metaData',
      type: 'pageMetaData',
    },
  ],
}
