export default {
  title: 'Legal Mumbo Jumbo PopUp',
  name: 'legalPopUp',
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
      name: 'popUpText',
      title: 'PopUp Text',
      type: 'text',
      required: true,
      validation: (Rule) => Rule.required().error('Please fill in all required fields.'),
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
