export default {
  title: 'Job Information',
  name: 'jobInformation',
  type: 'object',
  fields: [
    {
      title: 'Job List',
      name: 'jobList',
      type: 'array',
      of: [
        {
          title: 'Job',
          name: 'job',
          type: 'object',
          fields: [
            {
              title: 'Title',
              name: 'title',
              type: 'string',
            },
            {
              title: 'Description',
              name: 'description',
              type: 'string',
            },
            {
              title: 'Address',
              name: 'address',
              type: 'address',
            },
          ],
        },
      ],
    },
  ],
}
