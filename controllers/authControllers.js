
import mongoose from 'mongoose';  // Import mongoose
import User from '../models/user.js'
import { createToken } from '../utiles/tokenCreate.js'
import Category from '../models/categoryModel.js';
import City from '../models/cityModel.js'
import bcrypt from 'bcryptjs';





export const getDockterList = async (req, res) => {

    // console.log("get api list is")
    try {
        let doctor = await User.find({ role: "doctor", isActive: true }).sort({ createdAt: -1 })
            .populate({
                model: "Category",
                path: "specialization"
            })

        return res.status(200).json({
            success: true,
            message: "Doctor list fetched successfully",
            data: doctor
        });

    } catch (error) {
        console.error("Error fetching doctor:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch doctor list",
            error: error.message
        });
    }
};


// export const register = async (req, res) => {
//     try {
//         const { fullName, email, specialization, password, experience, mobileNo, role } = req.body;
//         console.log("register data is =======>", req.body)



//         const normalizedEmail = email.trim().toLowerCase();

//         // ✅ 5. Check if the email already exists
//         const existingUser = await User.findOne({ email: normalizedEmail });
//         if (existingUser) {
//             return res.status(409).json({ error: 'User email already exists' });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create a new user
//         const newUser = await User.create({
//             fullName,
//             email: normalizedEmail,
//             password: hashedPassword, // Use the hashed password
//             specialization: specialization || "",
//             mobileNo,
//             role: role || 'patient',
//             experience: experience || ""
//             // role: "employee",
//         });

//         // Respond with success message
//         res.status(201).json({
//             message: 'User created successfully',
//             user: {
//                 id: newUser._id,
//                 fullName: newUser.fullName,
//                 email: newUser.email,
//                 mobileNo: newUser.mobileNo,

//             },
//         });

//     } catch (err) {
//         console.error('Error during registration:', err); // Log the error for debugging
//         res.status(500).json({ error: 'User registration failed' }); // Send a generic error message
//     }
// };



export const register = async (req, res) => {
    try {
        const { fullName, email, specialization, password, gender, experience, mobileNo, role } = req.body;
        console.log("register data is =======>", req.body);

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedMobileNo = mobileNo.trim();

        // ✅ 1. Check if the email already exists
        const existingUserByEmail = await User.findOne({ email: normalizedEmail });
        if (existingUserByEmail) {
            return res.status(409).json({ error: 'User email already exists' });
        }

        // ✅ 2. Check if the mobile number already exists
        const existingUserByMobileNo = await User.findOne({ mobileNo: normalizedMobileNo });
        if (existingUserByMobileNo) {
            return res.status(409).json({ error: 'User mobile number already exists' });
        }

        // ✅ 3. Validate if specialization is a valid ObjectId (if it is provided)
        if (specialization && !mongoose.Types.ObjectId.isValid(specialization)) {
            return res.status(400).json({ error: 'Invalid specialization ID' });
        }

        // ✅ 4. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ 5. Create a new user
        const newUser = await User.create({
            fullName,
            email: normalizedEmail,
            password: hashedPassword, // Use the hashed password
            gender: gender || null,
            specialization: specialization || null,  // If specialization is not provided, set it to null
            mobileNo: normalizedMobileNo,
            role: role || 'patient',  // Default role as 'patient'
            experience: experience || 0 // Set default value for experience if not provided
        });

        // ✅ 6. Respond with success message
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                mobileNo: newUser.mobileNo,
            },
        });

    } catch (err) {
        console.error('Error during registration:', err); // Log the error for debugging
        res.status(500).json({ error: 'User registration failed' }); // Send a generic error message
    }
};



export const login = async (req, res) => {
    const { email, mobileNo, password } = req.body;

    try {
        if (!email && !mobileNo) {
            return res.status(400).json({ error: 'Email or mobile number is required' });
        }

        // 1. Find user
        const user = await User.findOne({ $or: [{ email }, { mobileNo }] });

        if (!user) {
            return res.status(404).json({ error: 'Invalid login credentials' });
        }

        // 2. Check if password exists in DB
        if (!user.password) {
            console.error('User password is missing from database for:', user.email || user.mobileNo);
            return res.status(500).json({ error: 'Account error. Please contact support.' });
        }

        // 3. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // 4. Generate token
        const token = createToken({
            id: user.id,
            role: user.role,
            name: user.fullName,
            email: user.email,
        });

        // 5. Set cookie
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        return res.status(200).json({ token, userId: user._id, name: user.fullName, email: user.email, role: user.role, message: 'Login Success' });
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ error: 'Login failed' });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie('accessToken', null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })
        return res.status(200).json({ message: 'logout Success' })
    } catch (error) {
        // responseReturn(res, 500, { error: error.message })
        res.status(500).json({ error: error.message });
    }
}

export const changePassword = async (req, res) => {
    const { email, old_password, new_password } = req.body;
    // console.log("change password")
    // console.log(email, old_password, new_password)
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Incorrect old password' });

        user.password = await bcrypt.hash(new_password, 10);
        await user.save();
        res.json({ message: 'Password changed successfully' });

    } catch (error) {
        console.log("error is =====>", error)
        res.status(500).json({ message: 'Server Error' });
    }
}

export const updateCustomerPassword = async (req, res) => {
    try {
        const { email, new_password } = req.body;
        // console.log("email is ======>", email);
        // console.log("new_password is ======>", new_password)


        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.password = await bcrypt.hash(new_password, 10);
        await user.save();

        res.json({ message: 'Password updated successfully by admin' });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

// export const getDoctorsBySpecialization = async (req, res) => {
//     try {
//         const { category, location, gender, experience } = req.query;

//         console.log("query data is =========>", req.query)

//         console.log("experience  =>", experience);

//         // Build the query filter object
//         let filter = {};

//         // If category (specialization) is provided, populate it
//         if (category) {
//             filter.specialization = category; // category should match specializationId in the User model
//         }

//         if (location) {
//             filter.location = location; // Match doctors by location
//         }

//         if (gender) {
//             filter.gender = gender; // Match doctors by gender
//         }

//         if (experience) {
//             filter.experience = { $gte: parseInt(experience) }; // Match doctors with experience >= provided value
//         }

//         // If experience is not provided or is empty, find all doctors regardless of experience
//         if (!experience || experience.trim() === '') {
//             delete filter.experience; // Remove the experience filter if it's empty or not provided
//         }

//         // Log the filter to check its contents
//         console.log("Filter object:", filter);

//         // Count the number of doctors matching the filter criteria
//         const totalCount = await User.countDocuments(filter);
//         console.log("Total count of matching doctors:", totalCount);

//         // Fetch doctors with the applied filters and populate specialization category
//         const doctors = await User.find(filter)
//             .populate({
//                 path: 'specialization',
//                 model: Category,
//                 select: 'name slug' // Only return name and slug from the Category model
//             });

//         // Log the resulting doctors to verify data
//         console.log("Doctors matching the filter:", doctors);

//         // Return the list of filtered doctors and the count
//         res.status(200).json({
//             totalCount,  // Send the count of doctors
//             doctors      // Send the list of doctors
//         });

//     } catch (err) {
//         console.error("Error fetching doctors:", err);
//         res.status(500).json({ message: 'Server error' });
//     }
// };


export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, email, mobileNo, password, address } = req.body;

        // Find the employee by ID
        let employee = await User.findById(id);

        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        // console.log("update body is =======>", req.body)

        // Hash password only if provided
        let hashedPassword = employee.password; // Keep old password if no new password is provided
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Update employee details
        employee.fullName = fullName || employee.fullName;

        employee.email = email || employee.email;
        employee.mobileNo = mobileNo || employee.mobileNo;
        employee.password = hashedPassword;
        employee.address = address || employee.address;

        // Save updated employee
        await employee.save();

        res.status(200).json({ message: 'Customer updated successfully', employee });
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ error: 'Employee update failed' });
    }
};


export const deleteEmployee = async (req, res) => {
    console.log("remove employee", req.params)
    try {
        const { id } = req.params;

        // Find and delete the Employee by ID
        const deletedEmployee = await User.findByIdAndDelete(id);

        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted successfully' });

    } catch (err) {
        console.error('Error deleting Employee:', err);
        res.status(500).json({ error: 'Employee deletion failed' });
    }
};


export const getDoctorsBySpecialization = async (req, res) => {
    try {
        const { category, location, gender, experience } = req.query;

        console.log("Query data is =========>", req.query);

        let filter = {};

        // Handle location filter
        if (location) {
            let city = await City.findOne({ name: location });
            if (!city) {
                return res.status(404).json({ message: 'City not found' }); // Handle case where city is not found
            }
            // console.log("Location is ====>", city);
            filter.city = city._id; // Set location filter as city ID
        }

        // Handle specialization (category) filter

        if (category) {
            filter.specialization = new mongoose.Types.ObjectId(category);; // category should match specializationId in the User model
        }
        // Handle gender filter
        if (gender) {
            filter.gender = gender; // Match doctors by gender
        }

        // Handle experience filter
        if (experience) {
            filter.experience = { $gte: parseInt(experience) }; // Match doctors with experience >= provided value
        }

        // Remove experience filter if not provided or is empty
        if (!experience || experience.trim() === '') {
            delete filter.experience;
        }

        // Log the final filter object
        console.log("Filter object:", filter);

        // Count the number of doctors matching the filter criteria
        const totalCount = await User.countDocuments(filter);
        console.log("Total count of matching doctors:", totalCount);

        // Fetch doctors with the applied filters and populate specialization category
        const doctors = await User.find(filter)
            .populate({
                path: 'specialization',
                model: Category,
                select: 'name slug' // Only return name and slug from the Category model
            });

        // Log the resulting doctors to verify data
        console.log("Doctors matching the filter:", doctors);

        // Handle case if no doctors are found
        if (doctors.length === 0) {
            return res.status(404).json({ message: 'No doctors found matching the filter criteria' });
        }

        // Return the list of filtered doctors and the count
        res.status(200).json({
            totalCount,  // Send the count of doctors
            doctors      // Send the list of doctors
        });

    } catch (err) {
        console.error("Error fetching doctors:", err);
        res.status(500).json({ message: 'Server error' });
    }
};



export const getDoctorsByMultipleFilters = async (req, res) => {
    try {
        const { category, location, gender, experience } = req.query;

        console.log("Query data is =========>", req.query);

        let filter = {};

        // Handle location filter
        if (location) {
            let city = await City.findOne({ name: location });
            if (!city) {
                return res.status(404).json({ message: 'City not found' }); // Handle case where city is not found
            }
            // console.log("Location is ====>", city);
            filter.city = city._id; // Set location filter as city ID
        }

        // Handle specialization (category) filter

        if (category) {
            filter.specialization = new mongoose.Types.ObjectId(category);; // category should match specializationId in the User model
        }
        // Handle gender filter
        if (gender) {
            filter.gender = gender; // Match doctors by gender
        }

        // Handle experience filter
        if (experience) {
            filter.experience = { $gte: parseInt(experience) }; // Match doctors with experience >= provided value
        }

        // Remove experience filter if not provided or is empty
        if (!experience || experience.trim() === '') {
            delete filter.experience;
        }

        // Log the final filter object
        console.log("Filter object:", filter);

        // Count the number of doctors matching the filter criteria
        const totalCount = await User.countDocuments(filter);
        console.log("Total count of matching doctors:", totalCount);

        // Fetch doctors with the applied filters and populate specialization category
        const doctors = await User.find(filter)
            .populate({
                path: 'specialization',
                model: Category,
                select: 'name slug' // Only return name and slug from the Category model
            })

            .populate({
                path: "city",
                model: "City",
                select: "name"
            })


        // Log the resulting doctors to verify data
        console.log("Doctors matching the filter:", doctors);

        // Handle case if no doctors are found
        if (doctors.length === 0) {
            return res.status(404).json({ message: 'No doctors found matching the filter criteria' });
        }

        // Return the list of filtered doctors and the count
        res.status(200).json({
            totalCount,  // Send the count of doctors
            doctors      // Send the list of doctors
        });

    } catch (err) {
        console.error("Error fetching doctors:", err);
        res.status(500).json({ message: 'Server error' });
    }
}

