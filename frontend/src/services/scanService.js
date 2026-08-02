import API from "./apiServices";

// Create a new scan
export const createScan = async (repositoryUrl) => {
  const response = await API.post("/scan", {
    repositoryUrl,
  });

  return response.data;
};

// Get scan details
export const getScanById = async (scanId) => {
  const response = await API.get(`/scan/${scanId}`);
  return response.data;
};