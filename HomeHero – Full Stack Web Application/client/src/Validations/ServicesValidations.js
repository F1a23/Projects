import * as yup from "yup";

// Product Schema with Custom Validation Messages
export const serviceSchemaValidation = yup.object().shape({
  scode: yup
    .string()
    .typeError("services id must be at least 6 characters long") // Custom type error for number
    .required("services id is required"),
  serviceType: yup.string().required("service Type is required"),
  description: yup.string().required("Description is required"),
  gender: yup.string().required("gender is required"),
  noWorks: yup.number().min(1).max(6).required(" Number of Works is required"),
  image: yup.string().required("Image URL is required"),
  price: yup
    .number()
    .typeError("Price must be a valid number") // Custom type error for number
    .required("Price is required"),
});
