export default {
  title: 'Next Step',
  name: 'nextSteps',
  type: 'object',
  fields: [
    {
      name: 'Heading',
      title: 'Heading',
      type: 'string',
    },
    {
      name: 'tile1',
      title: 'Tile 1',
      type: 'nextStepTiles',
    },
    {
      name: 'tile2',
      title: 'Tile 2',
      type: 'nextStepTiles',
    },
  ],
}
