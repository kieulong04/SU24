import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';

const AttributeList = () => {
  const [attributes, setAttributes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/attributes');
        setAttributes(response.data);
      } catch (error) {
        console.error('Error fetching attributes:', error);
      }
    };

    fetchAttributes();
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/admin/attributes/${id}/edit`);
  };

  const handleAddNew = () => {
    navigate('/admin/attributes/add');
  };

  const filteredAttributes = attributes.filter((attribute: any) =>
    attribute.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Danh sách thuộc tính</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Thêm mới
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm thuộc tính..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded w-full"
        />
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-left">STT</th>
            <th className="py-2 px-4 border-b text-left">Tên</th>
            <th className="py-2 px-4 border-b text-left">Ngày thêm</th>
            <th className="py-2 px-4 border-b text-center">Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttributes.map((attribute: any, index: number) => (
            <tr key={attribute._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{index + 1}</td>
              <td className="py-2 px-4 border-b">{attribute.name}</td>
              <td className="py-2 px-4 border-b">{new Date(attribute.createdAt).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b text-center">
                <button
                  onClick={() => handleEdit(attribute._id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FontAwesomeIcon icon={faEdit} className="h-5 w-5 inline" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttributeList;