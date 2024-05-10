export default {
    title: 'Pop-Out',
    name: 'popOut',
    type: 'document',
    __experimental_actions: ['update', /* 'create', 'delete', */ 'publish'],
    fields: [
      {
        title: 'Title',
        name: 'title',
        type: 'string',
      },
      {
        title: 'Pop-up',
        name: 'popUp',
        type: 'popUp',
      },
    ],
  }
  