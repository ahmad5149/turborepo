export default {
  title: 'Sell Or Trade',
  name: 'sellOrTrade',
  type: 'document',
  __experimental_actions: ['update', /* 'create', 'delete', */ 'publish'],
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },

    {
      title: 'Sell or Trade',
      name: 'sellOrTrade',
      type: 'sellTrade',
    },
    {
      title: 'Meta Data',
      name: 'metaData',
      type: 'pageMetaData',
    },
  ],
}
