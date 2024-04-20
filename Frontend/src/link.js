const BackendLink = process.env.REACT_APP_BACKEND_LINK || "http://localhost:5000";
const ImageCloud = process.env.REACT_APP_IMAGE_CLOUD || "http://localhost:5000/GetImage";
const StripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

export { BackendLink, ImageCloud, StripePublishableKey };
