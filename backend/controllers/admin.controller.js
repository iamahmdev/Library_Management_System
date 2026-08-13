import User from "../models/user.model.js";

// Get All Students - Admin can view all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password -resetPasswordToken -resetPasswordExpire")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.log("Error fetching students:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};

// Get Single Student - Admin can view one student
export const getSingleStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await User.findOne({
      _id: id,
      role: "student",
    }).select("-password -resetPasswordToken -resetPasswordExpire");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.log("Error fetching student:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student",
    });
  }
};

// Delete Student - Admin can delete a student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await User.findOne({
      _id: id,
      role: "student",
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    await student.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.log("Error deleting student:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete student",
    });
  }
};
