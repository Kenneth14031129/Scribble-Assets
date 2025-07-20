const API_BASE_URL = "http://localhost:5000/api";

// Fetch all assets from the database
export const fetchAssets = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/assets`);
    if (!response.ok) {
      throw new Error('Failed to fetch assets');
    }
    const result = await response.json();
    return result.data; // Return the assets array
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
};

export const fetchDisposedAssets = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/assets`);
    if (!response.ok) {
      throw new Error('Failed to fetch assets');
    }
    const result = await response.json();
    
    // Filter only out-of-service assets
    const disposedAssets = result.data.filter(asset => 
      asset.condition === 'out-of-service'
    );
    
    return disposedAssets;
  } catch (error) {
    console.error('Error fetching disposed assets:', error);
    throw error;
  }
};

// Create new asset
export const createAsset = async (assetData, imageFile) => {
  const formData = new FormData();

  Object.keys(assetData).forEach((key) => {
    if (assetData[key] !== undefined && assetData[key] !== "") {
      formData.append(key, assetData[key]);
    }
  });

  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await fetch(`${API_BASE_URL}/assets`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create asset");
  }

  return response.json();
};

// Update asset
export const updateAsset = async (id, assetData, imageFile) => {
  const formData = new FormData();

  Object.keys(assetData).forEach((key) => {
    if (assetData[key] !== undefined && assetData[key] !== "") {
      formData.append(key, assetData[key]);
    }
  });

  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update asset");
  }

  return response.json();
};

// Delete asset
export const deleteAsset = async (id) => {
  const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete asset");
  }

  return response.json();
};