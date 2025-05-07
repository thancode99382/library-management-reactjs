import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { topicService } from '../../services/topicService';
import { topicDetailService } from '../../services/topicDetailService';

export const TopicForm = () => {
  const { id } = useParams(); // If id exists, we're editing a topic
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form state
  const [topicName, setTopicName] = useState('');
  const [detailTopics, setDetailTopics] = useState([]);
  const [newDetailName, setNewDetailName] = useState('');
  const [editingDetailId, setEditingDetailId] = useState(null);
  const [editingDetailName, setEditingDetailName] = useState('');
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch topic data if in edit mode
  useEffect(() => {
    const fetchTopic = async () => {
      if (!isEditMode) return;

      try {
        setLoading(true);
        const topicData = await topicService.getTopicById(id);
        setTopicName(topicData.topicName || '');
        
        // Set detail topics from the topic query response
        if (topicData.detailTopics) {
          setDetailTopics(topicData.detailTopics);
        }
      } catch (err) {
        console.error('Error loading topic:', err);
        setError('Failed to load topic data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [id, isEditMode]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!topicName.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      if (isEditMode) {
        await topicService.updateTopic({ id, topicName });
        setSuccess('Category updated successfully!');
      } else {
        await topicService.createTopic({ topicName });
        setSuccess('Category created successfully!');
      }
      
      // Navigate back to topics list after a short delay
      setTimeout(() => {
        navigate('/topics');
      }, 1500);
    } catch (err) {
      console.error('Error saving topic:', err);
      setError('Failed to save the category. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Add a new detail topic
  const handleAddDetail = async () => {
    if (!newDetailName.trim()) {
      setError('Sub-category name is required');
      return;
    }

    try {
      setError(null);
      setSaving(true);
      
      const response = await topicDetailService.createTopicDetail({
        name: newDetailName,
        topicId: id
      });
      
      // Add the new detail to the list
      setDetailTopics([...detailTopics, response]);
      setNewDetailName('');
      setSuccess('Sub-category added successfully!');
      
      // Clear success message after a delay
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error adding topic detail:', err);
      setError('Failed to add sub-category. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Update a detail topic
  const handleUpdateDetail = async () => {
    if (!editingDetailName.trim() || !editingDetailId) {
      setError('Sub-category name is required');
      return;
    }

    try {
      setError(null);
      setSaving(true);
      
      await topicDetailService.updateTopicDetail({
        id: editingDetailId,
        name: editingDetailName
      });
      
      // Update the detail in the list
      const updatedDetails = detailTopics.map(detail => 
        detail.id === editingDetailId 
          ? { ...detail, name: editingDetailName } 
          : detail
      );
      
      setDetailTopics(updatedDetails);
      setEditingDetailId(null);
      setEditingDetailName('');
      setSuccess('Sub-category updated successfully!');
      
      // Clear success message after a delay
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating topic detail:', err);
      setError('Failed to update sub-category. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Delete a detail topic
  const handleDeleteDetail = async (detailId) => {
    try {
      setError(null);
      setSaving(true);
      
      await topicDetailService.deleteTopicDetail(detailId);
      
      // Remove the detail from the list
      setDetailTopics(detailTopics.filter(detail => detail.id !== detailId));
      setSuccess('Sub-category deleted successfully!');
      
      // Clear success message after a delay
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting topic detail:', err);
      setError('Failed to delete sub-category. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Start editing a detail topic
  const startEditingDetail = (detail) => {
    setEditingDetailId(detail.id);
    setEditingDetailName(detail.name);
  };

  // Cancel editing a detail topic
  const cancelEditingDetail = () => {
    setEditingDetailId(null);
    setEditingDetailName('');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-greenlove"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Navigation */}
      <div className="mb-6">
        <Link 
          to="/topics" 
          className="inline-flex items-center text-greenlove hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back to Categories
        </Link>
      </div>

      {/* Page title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? 'Edit Category' : 'Add New Category'}
      </h1>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">
          {success}
        </div>
      )}

      {/* Topic form */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="topicName" className="block text-sm font-medium text-gray-700 mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="topicName"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-greenlove focus:border-greenlove"
              placeholder="Enter category name"
              required
            />
          </div>

          {/* Form actions */}
          <div className="flex justify-end">
            <Link
              to="/topics"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-3"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-greenlove hover:bg-greenlove_1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-greenlove"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  {isEditMode ? 'Update Category' : 'Create Category'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Detail Topics section - only show in edit mode */}
      {isEditMode && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sub-Categories</h2>
            
            {/* Add new detail topic form */}
            <div className="mb-6 flex">
              <input
                type="text"
                value={newDetailName}
                onChange={(e) => setNewDetailName(e.target.value)}
                className="block flex-1 rounded-l-md border-gray-300 shadow-sm focus:ring-greenlove focus:border-greenlove"
                placeholder="Enter sub-category name"
              />
              <button
                type="button"
                onClick={handleAddDetail}
                disabled={saving || !newDetailName.trim()}
                className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-greenlove hover:bg-greenlove_1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-greenlove disabled:opacity-50"
              >
                <FaPlus className="mr-2" /> Add
              </button>
            </div>
            
            {/* List of detail topics */}
            <div className="space-y-4">
              {detailTopics.length > 0 ? (
                detailTopics.map(detail => (
                  <div key={detail.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    {editingDetailId === detail.id ? (
                      <div className="flex-1 flex">
                        <input
                          type="text"
                          value={editingDetailName}
                          onChange={(e) => setEditingDetailName(e.target.value)}
                          className="block flex-1 rounded-l-md border-gray-300 shadow-sm focus:ring-greenlove focus:border-greenlove"
                          placeholder="Enter sub-category name"
                        />
                        <button
                          type="button"
                          onClick={handleUpdateDetail}
                          disabled={saving || !editingDetailName.trim()}
                          className="px-2 py-1 bg-greenlove text-white rounded-tr-md hover:bg-greenlove_1"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditingDetail}
                          className="px-2 py-1 bg-gray-500 text-white rounded-br-md hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-gray-800">{detail.name}</span>
                        <div>
                          <button
                            type="button"
                            onClick={() => startEditingDetail(detail)}
                            className="text-blue-600 hover:text-blue-800 p-1 mr-1"
                          >
                            <FaEdit />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDetail(detail.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No sub-categories added yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};