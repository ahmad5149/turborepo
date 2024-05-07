export default {
    title: 'Fare Margin Levels',
    name: 'fareMarginLevels',
    type: 'object',
    fields: [
        {
            title: 'First Fare Price Range',
            name: 'firstFarePriceRange',
            type: 'fareCalculator',
        },
        {
            title: 'Second Fare Price Range',
            name: 'secondFarePriceRange',
            type: 'fareCalculator',
        },
        {
            title: 'Third Fare Price Range',
            name: 'thirdFarePriceRange',
            type: 'fareCalculator',
        },
        {
            title: 'Fourth Fare Price Range',
            name: 'fourthFarePriceRange',
            type: 'fareCalculator',
        }
    ]
}
