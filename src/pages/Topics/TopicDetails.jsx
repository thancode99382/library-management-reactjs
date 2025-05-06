import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { topicDetailService } from '../../services/topicDetailService';
import { topicService } from '../../services/topicService';

export const TopicDetails = () => {
  const { id } = useParams(); // Topic detail ID
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    topicId: ''
  });
  
  // Additional state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [topics, setTopics] = useState([]);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get all topics for the dropdown
        const topicsData = await topicService.getTopics();
        setTopics(topicsData);
        
        // Get topic detail data
        const detailData = await topicDetailService.getTopicDetailById(id);
        
        setFormData({
          name: detailData.name || '',
          topicId: detailData.topic?.id || ''
        });
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load subcategory data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      setError('Subcategory name is required');
      return;
    }

    if (!formData.topicId) {
      setError('Please select a parent category');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      // Update the topic detail
      await topicDetailService.updateTopicDetail({
        id,
        name: formData.name,
        topicId: formData.topicId
      });
      
      setSuccess('Subcategory updated successfully!');
      
      // Navigate back to topics list after a short delay
      setTimeout(() => {
        navigate('/topics');
      }, 1500);
    } catch (err) {
      console.error('Error updating subcategory:', err);
      setError('Failed to update the subcategory. Please try again.');
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
        Edit Subcategory
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

      {/* Topic detail form */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          {/* Subcategory name */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Subcategory Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-greenlove focus:border-greenlove"
              placeholder="Enter subcategory name"
              required
            />
          </div>

          {/* Parent category selection */}
          <div className="mb-6">
            <label htmlFor="topicId" className="block text-sm font-medium text-gray-700 mb-2">
              Parent Category <span className="text-red-500">*</span>
            </label>
            <select
              id="topicId"
              name="topicId"
              value={formData.topicId}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-greenlove focus:border-greenlove"
              required
            >
              <option value="">Select a category</option>
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {topic.topicName}
                </option>
              ))}
            </select>
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
                  Update Subcategory
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};