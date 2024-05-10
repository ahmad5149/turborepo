export default {
  title: 'FAQs',
  name: 'faqs',
  type: 'document',
  __experimental_actions: ['update', 'create', 'delete', 'publish'],

  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'FAQ Information',
      name: 'faqInformation',
      type: 'faqInformation',
    },
    {
      title: 'Meta Data',
      name: 'metaData',
      type: 'pageMetaData',
    },
  ],
}
