// queries.js
import { useQuery, useMutation, useQueryClient } from 'react-query';

const API_KEY = process.env.API_KEY;

// Helper: BASE_URL is passed as an argument to each function.
export const fetchWeather = async ({ queryKey }) => {
  const [_key, { latitude, longitude }] = queryKey;
  const response = await fetch(
    `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${API_KEY}&include=minutely`
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch weather');
  }
  return data.data[0];
};

export const useWeather = (latitude, longitude) => {
  return useQuery(['weather', { latitude, longitude }], fetchWeather, {
    enabled: !!latitude && !!longitude,
    refetchInterval: 60000, // refetch every minute, for example
  });
};

export const fetchFriends = async ({ queryKey }) => {
  const [_key, { currentUsername, BASE_URL }] = queryKey;
  const response = await fetch(
    `${BASE_URL}/api/friendship/friends/${currentUsername}`
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch friends');
  }
  return data.friends || [];
};

export const useFriends = (currentUsername, BASE_URL) => {
  return useQuery(
    ['friends', { currentUsername, BASE_URL }],
    async () => {
      const response = await fetch(
        `${BASE_URL}/api/friendship/friends/${currentUsername}`
      );
      if (!response.ok) {
        // Throw an error so that React Query doesn't cache stale data
        throw new Error('Friends not found');
      }
      const data = await response.json();
      return data.friends || [];
    },
    {
      enabled: !!currentUsername,
      retry: true,
      refetchOnWindowFocus: true,
      refetchInterval: 60000,
    }
  );
};

export const pushUser = async ({ payload, BASE_URL, authToken }) => {
  const response = await fetch(`${BASE_URL}/api/user_account/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to push user');
  }
  return data;
};

export const usePushUser = (BASE_URL, authToken) => {
  const queryClient = useQueryClient();
  return useMutation(payload => pushUser({ payload, BASE_URL, authToken }), {
    onSuccess: () => {
      // Invalidate friends query so that any changes (like accepted requests) are refetched.
      queryClient.invalidateQueries('friends');
    },
  });
};

export const fetchFriendRequests = async ({ queryKey }) => {
  const [_key, { username, BASE_URL, authToken }] = queryKey;
  const response = await fetch(
    `${BASE_URL}/api/friendship/requests/${username}`,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch friend requests');
  }
  return data.requests || [];
};

export const useFriendRequests = (username, BASE_URL, authToken) => {
  return useQuery(
    ['friendRequests', { username, BASE_URL, authToken }],
    fetchFriendRequests,
    {
      enabled: !!username && !!authToken,
      refetchOnWindowFocus: true,
      refetchInterval: 60000,
      retry: false,
    }
  );
};

export const acceptFriendRequest = async ({
  senderUsername,
  friendUsername,
  BASE_URL,
  authToken,
}) => {
  const response = await fetch(
    `${BASE_URL}/api/friendship/accept/${senderUsername}+${friendUsername}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to accept friend request');
  }
  return data;
};

export const rejectFriendRequest = async ({
  senderUsername,
  friendUsername,
  BASE_URL,
  authToken,
}) => {
  const response = await fetch(
    `${BASE_URL}/api/friendship/reject/${senderUsername}+${friendUsername}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to reject friend request');
  }
  return data;
};

export const useUpdateFriendRequest = (BASE_URL, authToken) => {
  const queryClient = useQueryClient();
  const acceptMutation = useMutation(
    payload => acceptFriendRequest({ ...payload, BASE_URL, authToken }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('friendRequests');
      },
    }
  );

  const rejectMutation = useMutation(
    payload => rejectFriendRequest({ ...payload, BASE_URL, authToken }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('friendRequests');
      },
    }
  );

  return { acceptMutation, rejectMutation };
};
