export default {
  title: 'Career Page',
  name: 'careerPage',
  type: 'document',
  __experimental_actions: ['update', 'create', 'delete', 'publish'],
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },

    {
      title: 'Position',
      name: 'position',
      type: 'position',
    },
    {
      title: 'Pinned Tile',
      name: 'pinnedTile',
      type: 'pinnedTile',
    },
    {
      title: 'Job Information',
      name: 'jobInformation',
      type: 'jobInformation',
    },
    {
      title: 'Meta Data',
      name: 'metaData',
      type: 'pageMetaData',
    },
  ],
}
