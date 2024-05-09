export const sortings = [
    { value: "mmr", label: "Sort by MMR" },
    { value: "nada", label: "Sort by NADA" },
    { value: "newest", label: "Sort by recently added" },
    { value: "milesLow", label: "Sort by lowest miles" },
    { value: "newModel", label: "Sort by newest model" },
    { value: "priceLow", label: "Sort by price low-high" },
    { value: "priceHigh", label: "Sort by price high-low" }
];

export const sortMapping = {
    priceHigh: { orderBy: "price", orderAsc: false },
    newest: { orderBy: "createdAt", orderAsc: false },
    priceLow: { orderBy: "price", orderAsc: true },
    milesLow: { orderBy: "mileage", orderAsc: true },
    newModel: { orderBy: "year", orderAsc: false },
    mmr: { orderBy: "mmr", orderAsc: false },
    nada: { orderBy: "nada", orderAsc: false }
    // newest: { orderBy: "updatedAt", orderAsc: false }
};

export const handleSortingChange = (selectedOption, setSortDropDown) => {
    setSortDropDown(selectedOption);
};
