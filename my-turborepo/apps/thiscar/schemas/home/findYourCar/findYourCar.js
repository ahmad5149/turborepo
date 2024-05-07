export default {
  title: 'Find Your Car',
  name: 'findYourCar',
  type: 'object',
  fields: [
    {
      title: 'Want To Know More?', //Know what you want?
      name: 'wantToKnow',
      type: 'headerSubText',
    },
    {
      name: 'shopByKeywordPlaceholder', //  placeholder
      description: 'Shop by keyword | make | model',
      title: 'Shop by Keyword - Placeholder',
      type: 'string',
    },

    {
      title: 'Shop Around?', //Want to shop around?
      name: 'shopAround',
      type: 'headerSubText',
    },
    {
      name: 'bodyStylePlaceholder', //  placeholder for search
      description: 'Body Style',
      title: 'Body Style - Placeholder',
      type: 'string',
    },
    // {
    //   name: 'pricePlaceholder', //  placeholder for search
    //   description: 'Price',
    //   title: 'Price - Placeholder',
    //   type: 'string',
    // },

    {
      title: 'Need Help - Ask Expert', // Need help deciding?
      name: 'needHelp',
      type: 'headerSubText',
    },
    {
      name: 'meetExpertPlaceholder', // Button text/label Placeholder
      description: 'Get our expert opinion ',
      title: 'Meet Expert - Placeholder',
      type: 'string',
    },
  ],
}
