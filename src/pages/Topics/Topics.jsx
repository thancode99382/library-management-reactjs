import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { topicService } from '../../services/topicService';
import { topicDetailService } from '../../services/topicDetailService';

export const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState({ id: null, type: null, name: '' });
  const [showAddDetailModal, setShowAddDetailModal] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [newDetailName, setNewDetailName] = useState('');
  const [addingDetail, setAddingDetail] = useState(false);

  // Fetch topics and their details
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const topicsData = await topicService.getTopics();
        setTopics(topicsData);
        
        // Initialize expanded state for each topic
        const expanded = {};
        topicsData.forEach(topic => {
          expanded[topic.id] = false;
        });
        setExpandedTopics(expanded);
      } catch (err) {
        console.error('Error loading topics:', err);
        setError('Failed to load topics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Toggle expansion of a topic to show/hide its details
  const toggleTopicExpansion = async (topicId) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  // Handle delete click for topic or topic detail
  const handleDeleteClick = (id, type, name) => {
    setDeleteItem({ id, type, name });
    setShowDeleteModal(true);
  };

  // Confirm deletion of a topic or topic detail
  const confirmDelete = async () => {
    if (!deleteItem.id) return;

    try {
      if (deleteItem.type === 'topic') {
        await topicService.deleteTopic(deleteItem.id);
        setTopics(topics.filter(topic => topic.id !== deleteItem.id));
      } else {
        await topicDetailService.deleteTopicDetail(deleteItem.id);
        // Update the topics state to remove the deleted detail
        setTopics(topics.map(topic => {
          if (topic.detailTopics) {
            return {
              ...topic,
              detailTopics: topic.detailTopics.filter(detail => detail.id !== deleteItem.id)
            };
          }
          return topic;
        }));
      }
      setShowDeleteModal(false);
      setDeleteItem({ id: null, type: null, name: '' });
    } catch (err) {
      console.error(`Error deleting ${deleteItem.type}:`, err);
      setError(`Failed to delete ${deleteItem.type}. Please try again.`);
    }
  };

  // Open modal to add a new detail to a topic
  const handleAddDetailClick = (topicId) => {
    setSelectedTopicId(topicId);
    setNewDetailName('');
    setShowAddDetailModal(true);
  };

  // Add a new detail to a topic
  const handleAddDetail = async () => {
    if (!selectedTopicId || !newDetailName.trim()) return;

    try {
      setAddingDetail(true);
      const newDetail = await topicDetailService.createTopicDetail({
        name: newDetailName.trim(),
        topicId: selectedTopicId
      });

      // Update the topics state to include the new detail
      setTopics(topics.map(topic => {
        if (topic.id === selectedTopicId) {
          return {
            ...topic,
            detailTopics: [...(topic.detailTopics || []), newDetail]
          };
        }
        return topic;
      }));

      setShowAddDetailModal(false);
      setSelectedTopicId(null);
      setNewDetailName('');
      
      // Ensure the parent topic is expanded to show the new detail
      setExpandedTopics(prev => ({
        ...prev,
        [selectedTopicId]: true
      }));
    } catch (err) {
      console.error('Error adding topic detail:', err);
      setError('Failed to add topic detail. Please try again.');
    } finally {
      setAddingDetail(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Category Management
        </h1>
        <Link 
          to="/topics/create" 
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-greenlove text-white rounded-md hover:bg-greenlove_1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-greenlove transition-colors"
        >
          <FaPlus className="mr-2" />
          Add New Category
        </Link>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-greenlove"></div>
        </div>
      ) : (
        <>
          {/* Topics list */}
          {topics.length === 0 ? (
            <div className="bg-gray-50 text-gray-500 p-8 rounded-md text-center">
              <p className="text-xl">No categories found</p>
              <p className="mt-2">Create a new category to get started.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="divide-y divide-gray-200">
                {topics.map(topic => (
                  <div key={topic.id} className="hover:bg-gray-50">
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <button 
                            onClick={() => toggleTopicExpansion(topic.id)}
                            className="text-gray-500 mr-3"
                            aria-label={expandedTopics[topic.id] ? 'Collapse' : 'Expand'}
                          >
                            {expandedTopics[topic.id] ? (
                              <FaChevronDown className="h-4 w-4" />
                            ) : (
                              <FaChevronRight className="h-4 w-4" />
                            )}
                          </button>
                          <h2 className="text-lg font-medium text-gray-900">
                            {topic.topicName}
                          </h2>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAddDetailClick(topic.id)}
                            className="p-2 bg-greenlove text-white rounded-md hover:bg-greenlove_1"
                            title="Add Subcategory"
                          >
                            <FaPlus size={14} />
                          </button>
                          <Link
                            to={`/topics/${topic.id}/edit`}
                            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            title="Edit Category"
                          >
                            <FaEdit size={14} />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(topic.id, 'topic', topic.topicName)}
                            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            title="Delete Category"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Topic details section */}
                    {expandedTopics[topic.id] && (
                      <div className="bg-gray-50 pl-12 pr-6 py-3">
                        <h3 className="text-sm font-medium text-gray-600 mb-2">
                          Subcategories
                        </h3>
                        {topic.detailTopics && topic.detailTopics.length > 0 ? (
                          <ul className="space-y-2">
                            {topic.detailTopics.map(detail => (
                              <li key={detail.id} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                                <span className="text-gray-800">{detail.name}</span>
                                <div className="flex space-x-2">
                                  <Link
                                    to={`/topics/details/${detail.id}/edit`}
                                    className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    title="Edit Subcategory"
                                  >
                                    <FaEdit size={12} />
                                  </Link>
                                  <button
                                    onClick={() => handleDeleteClick(detail.id, 'detail', detail.name)}
                                    className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    title="Delete Subcategory"
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 text-sm italic">
                            No subcategories found. Click the "+" button to add one.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="mb-6 text-gray-500">
              Are you sure you want to delete "{deleteItem.name}"? 
              {deleteItem.type === 'topic' && ' This will also delete all subcategories.'}
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add detail modal */}
      {showAddDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Subcategory</h3>
            <div className="mb-6">
              <label htmlFor="detailName" className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory Name
              </label>
              <input 
                type="text"
                id="detailName"
                value={newDetailName}
                onChange={(e) => setNewDetailName(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-greenlove focus:border-greenlove"
                placeholder="Enter subcategory name"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddDetailModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDetail}
                disabled={!newDetailName.trim() || addingDetail}
                className={`px-4 py-2 bg-greenlove text-white rounded-md hover:bg-greenlove_1 ${
                  (!newDetailName.trim() || addingDetail) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {addingDetail ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};