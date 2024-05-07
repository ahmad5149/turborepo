export default {
  title: 'FlyOut',
  name: 'flyoutFinancing',
  type: 'document',
  __experimental_actions: ['update', /* 'create', 'delete', */ 'publish'],
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Flyout',
      name: 'flyOut',
      type: 'flyOut',
    },
    {
      title: 'Chat Button',
      name: 'chatButton',
      type: 'chatButton',
    },
  ],
}
