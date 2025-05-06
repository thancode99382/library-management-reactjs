import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { topicService } from '../../services/topicService';

export const TopicForm = () => {
  const { id } = useParams(); // If id exists, we're editing a topic
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form state
  const [topicName, setTopicName] = useState('');
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
    </div>
  );
};