export default {
  title: 'About',
  name: 'about',
  type: 'document',
  __experimental_actions: ['update', /* 'create', 'delete', */ 'publish'],
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },

    {
      title: 'About - At The Heart',
      name: 'atTheHeart',
      type: 'atTheHeart',
    },
    {
      title: 'About - Personal Shopper',
      name: 'aboutPersonalShopper',
      type: 'aboutPersonalShopper',
    },
    {
      title: 'Online Car Buying Goodness',
      name: 'onlineCarBuying',
      type: 'onlineCarBuying',
    },
    {
      title: 'Smooth Relax Ride',
      name: 'smoothRelaxRide',
      type: 'smoothRelaxRide',
    },
    {
      title: 'This Car Promise',
      name: 'thisCarPromise',
      type: 'thisCarPromise',
    },
    {
      title: 'How We Roll',
      name: 'howWeRoll',
      type: 'howWeRoll',
    },
    {
      title: 'Meta Data',
      name: 'metaData',
      type: 'pageMetaData',
    },
  ],
}
