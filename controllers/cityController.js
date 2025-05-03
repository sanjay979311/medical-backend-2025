import City from '../models/cityModel.js';
import State from '../models/stateModel.js';
import Country from '../models/countryModel.js';


export const createCity = async (req, res) => {
    try {
        const { name, state, country } = req.body;
        // console.log("city data is =====>", req.body)
        // Check if the state and country exist
        const existingState = await State.findById(state);
        const existingCountry = await Country.findById(country);

        if (!existingState) return res.status(404).json({ message: "State not found" });
        if (!existingCountry) return res.status(404).json({ message: "Country not found" });

        // Check if the city already exists in the same state and country
        const existingCity = await City.findOne({ name, state, country });

        if (existingCity) {
            return res.status(400).json({ message: "City already exists in this state and country" });
        }

        // Create and save the new city
        const city = new City({ name, state, country });
        await city.save();

        res.status(201).json({ message: "City created successfully", city });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


// ✅ Get all cities (Admin & Customers)
export const getAllCities = async (req, res) => {
    try {
        const cities = await City.find().populate('state country', 'name').sort({ createdAt: -1 });;
        res.json(cities);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Get a single city by ID (Admin & Customers)
export const getSingleCity = async (req, res) => {
    try {
        const city = await City.findById(req.params.id).populate('state country', 'name');
        if (!city) return res.status(404).json({ message: "City not found" });
        res.json(city);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Get cities by state ID (Admin & Customers)
// export const getCitiesByState = async (req, res) => {
//     try {
//         const cities = await City.find({ state: req.params.stateId }).populate('state country', 'name');
//         if (!cities.length) return res.status(404).json({ message: "No cities found for this state" });
//         res.json(cities);
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error });
//     }
// };

export const getCitiesByState = async (req, res) => {
    try {
        console.log("Fetching cities for state ID:", req.params.stateId);

        // Find cities based on state ID
        const cities = await City.find({ state: req.params.stateId })
            .populate('state country', 'name')
            .exec();

        // Always return an array, even if empty
        res.status(200).json(cities.length ? cities : []);
    } catch (error) {
        console.error("Error fetching cities:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

export const getCitiesByCountry = async (req, res) => {
    try {
        const countryId = req.params.id;
        console.log("Fetching cities for country ID:", countryId);

        // Find cities based on country ID
        const cities = await City.find({ country: countryId })
            .populate('state country', 'name') // assuming you want to include state & country names
            .exec();

        res.status(200).json(cities); // returns empty array if none found, so no need to check length
    } catch (error) {
        console.error("Error fetching cities:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


export const getCityByStateId = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Fetching cities for state ID:", id);

        // Find cities based on the given state ID
        const cityList = await City.find({ state: req.params.id });

        // If no cities exist, return an empty array (not an error)
        if (!cityList.length) {
            return res.status(200).json([]); // Returning [] instead of 404
        }

        // Return the list of cities
        res.status(200).json(cityList);

    } catch (error) {
        console.error("Error fetching cities:", error);
        res.status(500).json({ message: 'Server error', error });
    }
}

// export const getCityByStateId = async (req, res) => {
//     try {
//         console.log("Fetching states for country ID:", req.params.id);

//         // Find states based on country ID
//         const cityList = await City.find({ state: req.params.id });

//         // Check if states exist
//         if (!cityList || cityList.length === 0) {
//             return res.status(404).json({ message: 'No cities found for this state', cityList: [] });
//         }

//         // Return the list of states
//         res.status(200).json(cityList);

//     } catch (error) {
//         console.error("Error fetching states:", error);
//         res.status(500).json({ message: 'Server error', error });
//     }
// }

// ✅ Update a city (Only Admin)
export const updateCity = async (req, res) => {
    try {
        const { name, state, country } = req.body;
        // console.log("update city is ========>", req.body)
        const city = await City.findByIdAndUpdate(req.params.id, { name, state, country }, { new: true });

        if (!city) return res.status(404).json({ message: "City not found" });

        res.json({ message: "City updated successfully", city });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Delete a city (Only Admin)
export const deleteCity = async (req, res) => {
    try {
        const city = await City.findByIdAndDelete(req.params.id);
        if (!city) return res.status(404).json({ message: "City not found" });
        res.json({ message: "City deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};