import * as yup from "yup";

export const userSchemaValidation = yup.object().shape({
  id: yup.string().required("ID is required"),
  name: yup.string().required("Name is required"),
  gender: yup.string().required("Gender is required"),
  civilNumber: yup.string().required("Civil Number is required"),
  birthDate: yup.date().required("Birth Date is required"),
  contactNo: yup
    .string()
    .matches(/^[7-9]\d{7}$/, "Contact No must be 8 digits starting with 7 or 9")
    .required("Contact No is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .matches(
      /^([a-zA-Z0-9._%+-]+)@utas\.edu\.om$/,
      "Email must be a valid UTAS email address"
    )
    .required("Email is required"),
  department: yup.string().required("Department is required"),
  specialization: yup.string().required("Specialization is required"),
  userType: yup.string().required("User Type is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});
