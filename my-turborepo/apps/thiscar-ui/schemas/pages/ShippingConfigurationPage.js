export default {
  title: 'Shipping Configuration',
  name: 'shippingConfiguration',
  type: 'document',
  __experimental_actions: ["update",  'create', 'delete',  "publish"],
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Zero Shipping Cost',
      name: 'zeroShippingCost',
      type: 'boolean',
    },
    {
      title: 'Padding Section for Shipping',
      name: 'paddingSection',
      type: 'paddingSection',
    },
    {
      title: 'Price Section',
      name: 'priceSection',
      type: 'priceSection',
    },
    {
      title: 'Distance Section',
      name: 'distanceSection',
      type: 'distanceSection',
    }
  ]
}
