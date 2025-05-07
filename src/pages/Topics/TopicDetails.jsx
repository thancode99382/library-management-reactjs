import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaLayerGroup, FaTags } from 'react-icons/fa';
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
      <div className="p-6 flex flex-col justify-center items-center min-h-[60vh] bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-greenlove mb-4"></div>
        <span className="text-lg font-medium text-gray-700">Loading subcategory data...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Navigation */}
      <div className="mb-6">
        <Link 
          to="/topics" 
          className="inline-flex items-center px-4 py-2 bg-white text-greenlove hover:text-greenlove_1 border border-gray-200 rounded-lg shadow-sm hover:shadow transition-all duration-200"
        >
          <FaArrowLeft className="mr-2" /> Back to Categories
        </Link>
      </div>

      {/* Page title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
        <FaLayerGroup className="mr-3 text-greenlove" />
        Edit Subcategory
      </h1>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow mb-8 flex items-start">
          <div className="mr-2 flex-shrink-0 mt-0.5">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow mb-8 flex items-start">
          <div className="mr-2 flex-shrink-0 mt-0.5">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-medium">Success</p>
            <p>{success}</p>
          </div>
        </div>
      )}

      {/* Topic detail form */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-greenlove to-green-600 py-4 px-6 text-white">
          <h2 className="text-xl font-semibold">Subcategory Information</h2>
          <p className="text-green-100 text-sm mt-1">
            Update the information for this subcategory
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Subcategory name */}
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaTags className="mr-2 text-greenlove" />
                Subcategory Name <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-greenlove focus:border-greenlove text-base transition-colors duration-200"
                placeholder="Enter subcategory name"
                required
              />
            </div>

            {/* Parent category selection */}
            <div className="relative">
              <label htmlFor="topicId" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaLayerGroup className="mr-2 text-greenlove" />
                Parent Category <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  id="topicId"
                  name="topicId"
                  value={formData.topicId}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-greenlove focus:border-greenlove text-base transition-colors duration-200 bg-white appearance-none"
                  required
                >
                  <option value="">Select a category</option>
                  {topics.map(topic => (
                    <option key={topic.id} value={topic.id}>
                      {topic.topicName}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Form actions */}
          <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end space-x-4">
            <Link
              to="/topics"
              className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className={`inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-greenlove hover:bg-greenlove_1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-greenlove transition-all duration-200 ${
                saving ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
              }`}
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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