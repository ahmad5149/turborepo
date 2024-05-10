export default {
  title: 'Faq Information',
  name: 'faqInformation',
  type: 'object',
  fields: [
    {
      title: 'Faq List',
      name: 'faqList',
      type: 'array',
      of: [
        {
          title: 'FAQ',
          name: 'faq',
          type: 'object',
          fields: [
            {
              title: 'Heading',
              name: 'heading',
              type: 'string',
              required: true,
              validation: (Rule) => Rule.required().error('Please fill in all required fields.'),
            },
            {
              title: 'Description',
              name: 'description',
              type: 'text',
              required: true,
              validation: (Rule) => Rule.required().error('Please fill in all required fields.'),
            },
          ],
        },
      ],
    },
  ],
}
