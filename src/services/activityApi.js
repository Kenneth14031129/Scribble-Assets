const API_BASE_URL = "http://localhost:5000/api";

// Get recent activities
export const fetchRecentActivities = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/activities`);
    if (!response.ok) {
      throw new Error('Failed to fetch activities');
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }
};

// Log new activity
export const logActivity = async (activityData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/activities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(activityData),
    });

    if (!response.ok) {
      throw new Error('Failed to log activity');
    }

    return response.json();
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
};