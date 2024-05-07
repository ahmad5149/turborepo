export default {
  title: 'Delivery Estimates',
  name: 'deliveryEstimates',
  type: 'object',
  fields: [
    {
      title: 'Delivery Estimates PopUp',
      name: 'deliveryPopUp',
      type: 'object',
      fields: [
        {
          name: 'popUpHeading',
          title: 'PopUp Heading',
          type: 'string',
          required: true,
          validation: (Rule) => Rule.required().error('Please fill in all required fields.'),
        },
        {
          title: 'Delivery Steps',
          name: 'deliverySteps',
          type: 'array',
          of: [
            {
              title: 'Delivery PopUp',
              name: 'deliveryPopUp',
              type: 'object',
              fields: [
                {
                  title: 'Delivery Steps',
                  name: 'deliverySteps',
                  type: 'text',
                  required: true,
                  validation: (Rule) =>
                    Rule.required().error('Please fill in all required fields.'),
                },
              ],
            },
          ],
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          required: true,
          validation: (Rule) => Rule.required().error('Please fill in all required fields.'),
        },
      ],
    },
  ],
}
