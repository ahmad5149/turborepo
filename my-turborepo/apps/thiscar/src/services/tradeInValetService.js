<<<<<<< HEAD
=======
import { db } from "./firebase-admin";
import { object, string, number, array } from "yup";

export const appraisalSchema = object({
    vin: string().required(),
    year: number().required(),
    make: string().required(),
    model: string().required(),
    trim: string().required(),
    bodyStyle: string().required(),
    engine: string().required(),
    driveline: string().required(),
    transmission: string().required(),
    odometer: number().required(),
    conditionType: string()
        .required()
        .oneOf(["Nicest One Ever", "Better Than Most", "Average", "A Few Issues", "Clunker"]),
    conditionOwners: string().required().oneOf(["Single Owner", "Multi-Owner"]),
    options: array().ensure(),
    customerComments: string().default(""),
    firstName: string().required(),
    lastName: string().required(),
    mobile: string().required(),
    email: string().email().required(),
    zipcode: string().required()
});

>>>>>>> feature/submit-bid
export class TIV {
    constructor() {
        this.accessToken = "";
        this.secret = process.env.TIV_SECRET;
        this.key = process.env.TIV_KEY;
        this.expiration = null;

        this.init();
    }

    async init() {
        if (this.expiration && this.expiration > Date.now()) {
            return;
        }

        try {
            const response = await fetch(`https://api.tradeinvalet.com/api/token`, {
                method: "post",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    apiKey: this.key,
                    secret: this.secret
                })
            });

            if (!response.ok) {
                console.log(response);
                throw new Error("Failed to fetch access token");
            }

            const data = await response.json();
            this.accessToken = data.accessToken;
            this.expiration = data.expiration * 1000;
            return;
        } catch (error) {
            console.error("Error fetching access token:", error);
            // we should do something with this error???
            throw new Error(error);
        }
    }

    async decodeVIN(vin) {
        await this.init(); // Ensure access token is valid

        try {
            const response = await fetch(`https://api.tradeinvalet.com/api/vehicleDecode/${vin}`, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to decode VIN");
            }

            return await response.json();
        } catch (error) {
            console.error("Error decoding VIN:", error);
            // Handle the error appropriately
            throw new Error(error);
        }
    }

    async decodeLicensePlate(plate, state) {
        await this.init();
        if (plate.length < 3) {
            return {
                error: "Valid License Plate Required"
            };
        }
        if (!state) {
            return {
                error: "Please select State"
            };
        }

        const vin = await fetch(`https://api.tradeinvalet.com/api/vehicleDecode/vin/${state}/${plate}`, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`
            }
        }).then((res) => res.json());

        const vehicleData = await this.decodeVIN(vin);

        return { ...vehicleData, vin };
    }

    async bidRequest(vehicleData) {
        await this.init();

        if (!vehicleData) {
            return { error: "Invalid payload request", payload: vehicleData };
        }

        console.log("Are we here?");
        const docRef = db.collection("appraisalRequest").doc();
        try {
            const parsedData = await appraisalSchema.validate(vehicleData, { abortEarly: false });

            parsedData.isNewOrUsed = "Used";
            parsedData.referenceNumber = docRef.id;
            parsedData.requestGuaranteedValue = true;
            parsedData.dealerId = 3499;
            console.log("finished validation and added?");
            const response = await fetch(`https://api.tradeinvalet.com/api/bidRequests`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    "content-type": "application/json"
                },
                body: JSON.stringify(parsedData)
            }).then((res) => res.json());

            await docRef.set({ ...response, ...parsedData, createdAt: new Date(), updatedAt: new Date() });

            return { ...response, ...parsedData };
        } catch (err) {
            console.log(err);
            throw err.errors;
        }
    }
}
