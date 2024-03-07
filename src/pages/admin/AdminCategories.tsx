
const AdminCategories = () => {
    return (<div>
        <h1>ניהול קטגוריות</h1>
        <button>הוסף קטגוריה חדשה</button>
        <table>
            <thead>
            <tr>
                <th>Category ID</th>
                <th>Category Name</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>1</td>
                <td>Jewelry</td>
                <td>
                    <button>Edit</button>
                    <button>Delete</button>
                </td>
            </tr>
            <tr>
                <td>2</td>
                <td>Paintings</td>
                <td>
                    <button>Edit</button>
                    <button>Delete</button>
                </td>
            </tr>
            <tr>
                <td>3</td>
                <td>Art</td>
                <td>
                    <button>Edit</button>
                    <button>Delete</button>
                </td>
            </tr>
            </tbody>
        </table>
    </div>)
};

export default AdminCategories;
