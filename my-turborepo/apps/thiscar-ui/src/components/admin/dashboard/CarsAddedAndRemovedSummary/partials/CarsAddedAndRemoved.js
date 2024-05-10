import React, { useContext } from "react";
import Select from "react-select";
import AppContext from "../../../../../StateManagement/AppContext"; // Update the path as necessary

export const CarsAddedAndRemove = () => {
    const {
        options,
        TotalCarsSummary,
        setTotalCarsSummary,
        setShowSpecificWidgetSettings,
        setLoadingDropdown,
        setCreatedAtCarsCount,
        setDeletedTimeCarsCount,
        params,
        routerNav,
        pathname,
        createdAtCarsTotalCount,
        deletedTimeCarsTotalCount
    } = useContext(AppContext);

    const handleDropdownChange = async (selectedOption) => {
        const newValue = selectedOption.value;

        // Update TotalCarsSummary with new selectedOptionIndex
        setTotalCarsSummary((prevState) => ({
            ...prevState,
            selectedOptionIndex: TotalCarsSummary.options.indexOf(newValue)
        }));

        setShowSpecificWidgetSettings((prevState) => ({
            ...prevState,
            show: false,
            label: ""
        }));
        document.body.style.overflow = "auto";

        // Update chart data based on selected option
        const noOfDays = getNumberOfDays(newValue);
        // Update TotalCarsSummary with new chart data and chart categories
        const categories = Array.from({ length: noOfDays }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            return date.toLocaleDateString("en-US", { weekday: "short" });
        });
        // Update TotalCarsSummary with new chart categories
        setTotalCarsSummary((prevState) => ({
            ...prevState,
            chartCategories: categories.reverse()
        }));
    };

    // Define a function to get the number of days based on the selected option
    const getNumberOfDays = (option) => {
        const daysMapping = {
            last7DaysCars: 7,
            last3DaysCars: 3,
            last1DayCars: 1
        };
        return daysMapping[option] || 7;
    };

    const updateChartData = (startDate, noOfDays, data) => {
        if (!data || !Array.isArray(data)) {
            return {
                newData: [],
                categories: []
            };
        }

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + noOfDays - 1);

        // Filter data for the selected number of days
        const newData = data.filter((item) => {
            const itemDate = new Date(item.date); // Assuming date is available in each item
            return itemDate >= startDate && itemDate <= endDate;
        });

        // Generate categories (days) for the chart based on the selected number of days
        const categories = Array.from({ length: noOfDays }, (_, i) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            return date.toLocaleDateString("en-US", { weekday: "short" });
        });

        return {
            newData,
            categories
        };
    };

    // const updateChartData = (startDate, noOfDays, data) => {
    //     if (!data || !Array.isArray(data)) {
    //         return [];
    //     }

    //     const startIndex = 7 - noOfDays;
    //     let newData = [...data];
    //     if (noOfDays !== 7) {
    //         newData = newData.slice(startIndex);
    //     }
    //     return newData;
    // };

    const selectOptions = TotalCarsSummary.options.map((option, index) => ({
        value: option,
        label: option === "last7DaysCars" ? "Last 7 days" : option === "last3DaysCars" ? "Last 3 days" : "Last 1 day"
    }));

    return (
        <div className="mb-10">
            <Select
                options={selectOptions}
                value={selectOptions[TotalCarsSummary.selectedOptionIndex]}
                onChange={handleDropdownChange}
                menuPortalTarget={document.body} // Ensure the dropdown is rendered within the body
                styles={{
                    menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999 // Set a high z-index to ensure it appears on top of other elements
                    })
                }}
            />
        </div>
    );
};

// import React, { useContext } from "react";
// import Select from "react-select";
// import AppContext from "../../../../../StateManagement/AppContext"; // Update the path as necessary

// export const CarsAddedAndRemove = () => {
//     const {
//         options,
//         selectedOptionIndex,
//         chartCategories,
//         TotalCarsSummary,
//         setTotalCarsSummary,
//         setShowSpecificWidgetSettings
//     } = useContext(AppContext);
//     // const handleDropdownChange = async (newValue) => {
//     //     const noOfDays = getNumberOfDays(newValue);

//     //     // Update TotalCarsSummary with new selectedOptionIndex
//     //     setTotalCarsSummary((prevState) => ({
//     //         ...prevState,
//     //         selectedOptionIndex: noOfDays
//     //     }));
//     //     setShowSpecificWidgetSettings((prevState) => ({
//     //         ...prevState,
//     //         show: false,
//     //         label: ""
//     //     }));
//     //     document.body.style.overflow = "auto";
//     // };

//     const getNumberOfDays = (option) => {
//         const daysMapping = {
//             last7dayscars: 7,
//             last3dayscars: 3,
//             last1daycars: 1
//         };
//         return daysMapping[option] || 7;
//     };

//     const selectOptions = TotalCarsSummary.options.map((option, index) => ({
//         value: option,
//         label: option === "last7DaysCars" ? "Last 7 days" : option === "last3DaysCars" ? "Last 3 days" : "Last 1 day"
//     }));

//     return (
//         <div className="mb-10">
//             <Select
//                 options={selectOptions}
//                 value={selectOptions[TotalCarsSummary.selectedOptionIndex]}
//                 onChange={(selectedOption) => handleDropdownChange(selectedOption.value)}
//                 menuPortalTarget={document.body} // Ensure the dropdown is rendered within the body
//                 styles={{
//                     menuPortal: (base) => ({
//                         ...base,
//                         zIndex: 9999 // Set a high z-index to ensure it appears on top of other elements
//                     })
//                 }}
//             />
//         </div>
//     );
// };
