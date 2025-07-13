import React, { useState } from 'react'
import { User, Mail, MapPin, Globe, Award, MessageSquare, HelpCircle, Eye, ThumbsUp, Edit3, Camera, Star, Trophy, Medal, Loader } from 'lucide-react'
import { useAuth } from '@/lib/auth'

function UserProfile() {
  const { user, isLoading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  
  console.log("User Profile:", user, isLoading)

  const [editData, setEditData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || ''
  })

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  // No user state
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No user data available</p>
        </div>
      </div>
    )
  }

  const handleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving profile data:', editData)
    setIsEditing(false)
  }

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const StatCard = ({ icon: Icon, label, value, color = "text-blue-600" }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </div>
  )

  const BadgeDisplay = ({ type, count, color }) => (
    <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
      <div className={`w-4 h-4 rounded-full ${color}`}></div>
      <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
      <span className="text-lg font-bold text-gray-900">{count}</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name || 'User'} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 shadow-lg hover:bg-blue-600 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">{user?.name || 'User'}</h1>
                  <p className="text-blue-100 text-lg">@{user?.username || 'username'}</p>
                </div>
                <button
                  onClick={handleEdit}
                  className="mt-2 md:mt-0 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <Mail className="w-4 h-4 text-blue-200" />
                  <span className="text-blue-100">{user?.email || 'No email'}</span>
                </div>
                {user?.location && (
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <MapPin className="w-4 h-4 text-blue-200" />
                    <span className="text-blue-100">{user.location}</span>
                  </div>
                )}
                {user?.website && (
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <Globe className="w-4 h-4 text-blue-200" />
                    <span className="text-blue-100">{user.website}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Edit Form */}
        {isEditing && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter your location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={editData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleEdit}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Star}
            label="Reputation"
            value={user?.reputation || 0}
            color="text-yellow-600"
          />
          <StatCard
            icon={MessageSquare}
            label="Answers"
            value={user?.answersCount || 0}
            color="text-green-600"
          />
          <StatCard
            icon={HelpCircle}
            label="Questions"
            value={user?.questionsCount || 0}
            color="text-blue-600"
          />
          <StatCard
            icon={Eye}
            label="Views"
            value={user?.viewsCount || 0}
            color="text-purple-600"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'badges', 'activity'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">About</h3>
                  <p className="text-gray-600">
                    {user?.bio || 'No bio available. Edit your profile to add a bio.'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Quick Stats</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{user?.reputation || 0}</div>
                      <div className="text-sm text-gray-500">Reputation</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{user?.answersCount || 0}</div>
                      <div className="text-sm text-gray-500">Answers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{user?.questionsCount || 0}</div>
                      <div className="text-sm text-gray-500">Questions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{user?.votesReceived || 0}</div>
                      <div className="text-sm text-gray-500">Votes</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'badges' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Badges</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <BadgeDisplay
                      type="gold"
                      count={user?.badges?.gold || 0}
                      color="bg-yellow-400"
                    />
                    <BadgeDisplay
                      type="silver"
                      count={user?.badges?.silver || 0}
                      color="bg-gray-400"
                    />
                    <BadgeDisplay
                      type="bronze"
                      count={user?.badges?.bronze || 0}
                      color="bg-orange-400"
                    />
                  </div>
                </div>
                
                {(!user?.badges?.gold && !user?.badges?.silver && !user?.badges?.bronze) && (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No badges earned yet. Keep participating to earn your first badge!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Answered {user?.answersCount || 0} questions</p>
                        <p className="text-xs text-gray-500">Contributing to the community</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <HelpCircle className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">Asked {user?.questionsCount || 0} questions</p>
                        <p className="text-xs text-gray-500">Engaging with the community</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Star className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium">Earned {user?.reputation || 0} reputation points</p>
                        <p className="text-xs text-gray-500">Building credibility</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile