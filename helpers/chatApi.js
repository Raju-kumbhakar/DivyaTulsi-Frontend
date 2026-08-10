const BASE_URL = 'http://172.168.17.209:8080/api/chat';

export const chatApi = {
  // Send message
  async sendMessage(messageData) {
    try {
      const response = await fetch(`${BASE_URL}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Get chat history
  async getChatHistory(userPhone, otherPhone) {
    try {
      const response = await fetch(
        `${BASE_URL}/history?userPhone=${userPhone}&otherPhone=${otherPhone}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  },

  // Get all registered users
  async getRegisteredUsers() {
    try {
      const response = await fetch(`${BASE_URL}/debug/users`);

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      return data.users || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
};