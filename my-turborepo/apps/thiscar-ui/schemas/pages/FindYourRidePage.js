export default {
  title: 'Find Your Ride',
  name: 'findYourRide',
  type: 'document',
  __experimental_actions: ['update', 'create', 'delete', 'publish'],
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Contact Details SRP',
      name: 'contactDetails',
      type: 'contactDetails',
    },
    {
      title: 'Meta Data',
      name: 'metaData',
      type: 'pageMetaData',
    },
  ],
}
