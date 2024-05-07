import { appConfig } from "../appConfig";

async function Get(url = "") {
    return fetch(url, {
        method: "GET",
        headers: {
            "X-API-Key": process.env.NEXT_PUBLIC_API_KEY
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Process the retrieved data
            return data;
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

async function GetByID(url = "", id = 0) {
    return fetch(`${url}/${id}`, {
        cache: "no-store",
        method: "GET",
        headers: {
            "X-API-Key": process.env.NEXT_PUBLIC_API_KEY
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Process the retrieved data
            return data;
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

async function GetByParams(url = "", params = {}) {
    const queryString = Object.keys(params)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join("&");

    // Append query string to the URL
    const urlWithParams = `${url}?${queryString}`;

    return fetch(urlWithParams, {
        method: "GET",
        headers: {
            "X-API-Key": process.env.NEXT_PUBLIC_API_KEY
        }
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Process the retrieved data
            return data;
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

async function Post(url = "", data = {}) {
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-Key": process.env.NEXT_PUBLIC_API_KEY
        },
        body: data ? JSON.stringify(data) : {} // body data type must match "Content-Type" header
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.log("Error:", error);
            return error;
        });
}

async function PostWithRevalidation(url = "", data = {}) {
    return fetch(url, {
        cache: "no-store",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-Key": process.env.NEXT_PUBLIC_API_KEY
        },
        body: data ? JSON.stringify(data) : {} // body data type must match "Content-Type" header
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.log("Error:", error);
            return error;
        });
}
async function PostASync(url = "", data = {}) {
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-Key": process.env.NEXT_PUBLIC_API_KEY
        },
        body: data ? JSON.stringify(data) : {} // body data type must match "Content-Type" header
    });
}
//For VDP ThirdPartyTools
async function PostThirdPartyTools(url = "", data = {}) {
    return await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.VELOCITY_AUTOMOTIVE_TOKEN}`
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Process the retrieved data
            return data;
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

async function Put(url = "", data = {}) {
    return fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-API-Key": process.env.NEXT_PUBLIC_API_KEY
        },
        body: JSON.stringify(data)
    })
        .then((response) => {
            if (response.ok) {
                // PUT request successful
                return response.json();
            } else {
                // Error occurred
                throw new Error("PUT request failed.");
            }
        })
        .then((result) => {
            // Handle the result of the PUT request
            return result;
        })
        .catch((error) => {
            // Handle any errors that occurred during the PUT request
            console.error(error);
        });
}

async function Delete(url, id) {
    return fetch(`${url}/${id}`, {
        method: "DELETE",
        headers: {
            "X-API-Key": process.env.NEXT_PUBLIC_API_KEY
        }
    })
        .then((response) => {
            if (response.ok) {
                // DELETE request successful
            } else {
                // Error occurred
                throw new Error(`DELETE request for ID ${id} failed.`);
            }
        })
        .catch((error) => {
            // Handle any errors that occurred during the DELETE request
            console.error(error);
            return false;
        });
}

export { Get, GetByID, GetByParams, Post, PostWithRevalidation, Put, Delete, PostThirdPartyTools, PostASync };
