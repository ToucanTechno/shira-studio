import './AdminOrders.css';

const AdminOrders = () => {
    // Example functions (you can implement these in your backend)
    function viewOrderDetails(orderId: string) {
        // Show order details modal or navigate to a details page
        console.log(`View details for order ${orderId}`);
    }

    function updateOrderStatus(orderId: string, status: string) {
        // Update order status (e.g., via API call)
        console.log(`Update status for order ${orderId} to ${status}`);
    }

    // Search and filter functionality
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const rows = document.querySelectorAll('tbody tr');

    function applyFilters() {
        // const searchText = searchInput.value.toLowerCase();
        // const selectedStatus = statusFilter.value.toLowerCase();

        rows.forEach(row => {
            // const orderId = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
            // const customerName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            // const status = row.querySelector('td:nth-child(4)').textContent.toLowerCase();

            // const matchesSearch = orderId.includes(searchText) || customerName.includes(searchText);
            // const matchesStatus = selectedStatus === '' || status === selectedStatus;

            // row.style.display = matchesSearch && matchesStatus ? 'table-row' : 'none';
        });
    }

    // searchInput.addEventListener('input', applyFilters);
    // statusFilter.addEventListener('change', applyFilters);
    return (<div>
        <h1>Order Management</h1>
        <input type="text" id="searchInput" placeholder="Search by Order ID or Customer Name"/>
        <select id="statusFilter">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
        </select>
        <table>
            <thead>
            <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Shipping Option</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>1001</td>
                <td>John Doe</td>
                <td>$250</td>
                <td className="status-pending">Pending</td>
                <td>Paid</td>
                <td>Shipping</td>
                <td>
                    <button onClick={() => viewOrderDetails('1001')}>View Details</button>
                    <button onClick={() => updateOrderStatus('1001', 'shipped')}>Mark as Shipped</button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>)
};

export default AdminOrders;
