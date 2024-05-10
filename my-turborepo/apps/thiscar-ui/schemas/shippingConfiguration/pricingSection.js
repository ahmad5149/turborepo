export default {
  title: 'Price Section',
  name: 'priceSection',
  type: 'object',
  fields: [
    {
      title: 'Price Per Mile',
      name: 'pricePerMile',
      type: 'number',
    },
    {
      title: 'Shipping Fare Calculation',
      name: 'fareMarginCalculation',
      type: 'fareMarginLevels',
    },
  ]
}
