const API_URL = 'http://localhost:3000/api';

const auth = {
    login: async (username, password) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error' };
        }
    },

    logout: () => {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    },

    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    requireAuth: () => {
        const user = auth.getUser();
        if (!user) {
            window.location.href = 'login.html';
        }
        return user;
    }
};
