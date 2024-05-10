export default {
  title: 'Fare Calculations',
  name: 'fareCalculator',
  type: 'object',
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Minimum Fare Price Level' ,
      name: 'minimumFarePriceLevel',
      type: 'number'
    },
    {
      title: 'Maximum Fare Price Level',
      name: 'maximumFarePriceLevel',
      type: 'number',
    },
    {
      title: 'Fare Margin Fee',
      name: 'fareMarginFee',
      type: 'number',
    },
  ]
}
