export default {
  title: 'Our Cars PopUp',
  name: 'ourCarsPopUp',
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
      name: 'upperText',
      title: 'Upper Text',
      type: 'string',
    },
    {
      title: 'List 1',
      name: 'list1',
      type: 'array',
      of: [
        {
          title: 'List 1',
          name: 'list1',
          type: 'object',
          fields: [
            {
              title: 'Point',
              name: 'point',
              type: 'string',
            },
          ],
        },
      ],
    },
    {
      name: 'mainText',
      title: 'Main Text',
      type: 'text',
    },
    {
      name: 'lowerText',
      title: 'Lower Text',
      type: 'string',
    },
    {
      title: 'List 2',
      name: 'list2',
      type: 'array',
      of: [
        {
          title: 'List 2',
          name: 'list2',
          type: 'object',
          fields: [
            {
              title: 'Point',
              name: 'point',
              type: 'string',
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
}
