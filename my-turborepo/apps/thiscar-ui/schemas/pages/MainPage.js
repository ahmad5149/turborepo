export default {
  title: 'Main',
  name: 'main',
  type: 'document',
  __experimental_actions: ['update', /* 'create', 'delete', */ 'publish'],
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Header',
      name: 'header',
      type: 'header',
    },
    {
      title: 'Footer',
      name: 'footer',
      type: 'footer',
    },
    {
      title: 'Mobile Hamburger Menu',
      name: 'hamburger',
      type: 'hamburger',
    },
    // {
    //   title: 'Pop-up',
    //   name: 'popUp',
    //   type: 'popUp',
    // },
  ],
}
