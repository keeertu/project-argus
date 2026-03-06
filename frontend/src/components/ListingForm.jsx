import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ListingForm({ onSubmit, isLoading, initialData = {} }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    locality: '',
    city: 'Bangalore',
    property_type: '1BHK',
    contact_number: '',
    images: null
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Chennai'];
  const propertyTypes = ['1BHK', '2BHK', '3BHK', 'PG'];

  const localityPlaceholders = {
    'Bangalore': 'e.g., Koramangala, Indiranagar, HSR Layout',
    'Mumbai': 'e.g., Bandra, Andheri, Powai',
    'Delhi': 'e.g., Lajpat Nagar, Dwarka, Saket',
    'Pune': 'e.g., Hinjewadi, Kothrud, Baner',
    'Hyderabad': 'e.g., Gachibowli, Madhapur, Kondapur',
    'Chennai': 'e.g., Adyar, Anna Nagar, OMR'
  };

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price || '',
        locality: initialData.locality || '',
        city: initialData.city || 'Bangalore',
        property_type: initialData.property_type || '1BHK',
        contact_number: initialData.contact_number || '',
        images: null
      });
      setImagePreviews([]);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setFormData(prev => ({ ...prev, images: files }));
    
    // Generate previews
    const previews = [];
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === files.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (key === 'images' && formData.images) {
        Array.from(formData.images).forEach(file => {
          data.append('images', file);
        });
      } else if (key !== 'images') {
        data.append(key, formData[key]);
      }
    });
    
    onSubmit(data);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="bg-dark-card rounded-2xl p-6 md:p-8 shadow-2xl"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="text-3xl md:text-4xl">🔍</span>
        <span>Analyze Rental Listing</span>
      </h2>
      
      <div className="space-y-5">
        {/* Listing Title */}
        <div>
          <label className="block text-gray-300 mb-2 text-sm font-semibold">
            Listing Title <span className="text-status-scam">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-dark-bg border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            placeholder="e.g., Spacious 2BHK in Koramangala"
          />
        </div>

        {/* City and Locality */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-semibold">
              City <span className="text-status-scam">*</span>
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-bg border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm font-semibold">
              Locality <span className="text-status-scam">*</span>
            </label>
            <input
              type="text"
              name="locality"
              value={formData.locality}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-dark-bg border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              placeholder={localityPlaceholders[formData.city]}
            />
          </div>
        </div>

        {/* Price and Property Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-semibold">
              Monthly Rent <span className="text-status-scam">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-semibold">₹</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full pl-8 pr-4 py-3 bg-dark-bg border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                placeholder="25000"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm font-semibold">
              Property Type <span className="text-status-scam">*</span>
            </label>
            <div className="flex gap-2">
              {propertyTypes.map(type => (
                <label
                  key={type}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all text-center font-medium ${
                    formData.property_type === type
                      ? 'border-accent bg-accent/20 text-accent'
                      : 'border-gray-700 bg-dark-bg text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="property_type"
                    value={type}
                    checked={formData.property_type === type}
                    onChange={handleChange}
                    className="hidden"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-300 mb-2 text-sm font-semibold">
            Listing Description <span className="text-status-scam">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            className="w-full px-4 py-3 bg-dark-bg border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none"
            placeholder="Describe the property, amenities, location, and any other relevant details..."
          />
        </div>

        {/* Contact Number */}
        <div>
          <label className="block text-gray-300 mb-2 text-sm font-semibold">
            Contact Number <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <input
            type="tel"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-dark-bg border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            placeholder="9876543210"
          />
        </div>

        {/* Upload Photos */}
        <div>
          <label className="block text-gray-300 mb-2 text-sm font-semibold">
            Property Images <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <input
            type="file"
            name="images"
            onChange={handleFileChange}
            multiple
            accept="image/jpeg,image/png,image/jpg"
            className="w-full px-4 py-3 bg-dark-bg border border-gray-700 rounded-lg text-gray-400 focus:outline-none focus:border-accent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent file:text-white file:cursor-pointer file:font-semibold hover:file:bg-accent/80"
          />
          
          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {imagePreviews.map((preview, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-700"
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-accent text-white font-bold text-base md:text-lg rounded-lg hover:bg-accent/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-3 min-h-[44px] touch-manipulation"
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              <span>Analyzing with AI...</span>
            </>
          ) : (
            <>
              <span>🔍</span>
              <span>Analyze Listing</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}
