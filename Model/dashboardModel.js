let dashboardData = [
    { id: 1, name: 'Widget 1', value: 100 },
    { id: 2, name: 'Widget 2', value: 200 },
    { id: 3, name: 'Widget 3', value: 300 }
];

module.exports = {
    getAllItems: () => {
        return [...dashboardData];
    },
    getItemById: (id) => {
        return dashboardData.find(item => item.id === parseInt(id));
    },
    createItem: (newItem) => {
        const id = dashboardData.length + 1;
        const item = { id, ...newItem };
        dashboardData.push(item);
        return item;
    },
    updateItem: (id, updatedItem) => {
        const index = dashboardData.findIndex(item => item.id === parseInt(id));
        if (index !== -1) {
            dashboardData[index] = { ...dashboardData[index], ...updatedItem };
            return { ...dashboardData[index] };
        }
        return null;
    },
    deleteItem: (id) => {
        const initialLength = dashboardData.length;
        dashboardData = dashboardData.filter(item => item.id !== parseInt(id));
        return initialLength !== dashboardData.length;
    }
};