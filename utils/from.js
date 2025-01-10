"use client";

import api from '@/lib/axios';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { UploaderIcon } from '../../../../assets/icons';
import { errorMessage } from '@/lib/errorMessage';
import { useUser } from '@/Context/Context';

const Settings = () => {
  const { settings } = useUser();
  const [favicon, setFavicon] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [values, setValues] = useState({});
  const [selectedColor, setSelectedColor] = useState(null);

  const faviconInputRef = useRef(null); // Ref for favicon input
  const logoInputRef = useRef(null); // Ref for logo input

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // Append non-file values to the formData
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      // Append files to the formData
      if (logo) formData.append('logo', logo);
      if (favicon) formData.append('favicon', favicon);

      const res = await api.post('/settings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(res)
      if (res.status == 200) {
        console.log('test')
        toast.success(res.data.message);
      } else {
        errorMessage(res?.errors)
      }

      console.log('Post response:', res);
    } catch (error) {
      console.error('Error submitting form:', error);
      errorMessage(error?.response?.data?.errors)
    }
  };

  const handleFavicon = (e) => {
    const file = e.target.files[0];
    setFavicon(file);


    // Generate preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setFaviconPreview(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleLogo = (e) => {
    const file = e.target.files[0];
    setLogo(file);

    // Generate preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (e) => {
    const color = e.target.value;
    setSelectedColor(color);
    handleChange(e); // Ensure to call the handleChange function passed as a prop
  };

  const getSettings = async () => {
    const res = await api.get('/settings');
    if (res?.data?.data) {
      setValues({
        title: res?.data?.data?.title,
        description: res?.data?.data?.description,
        copyright: res?.data?.data?.copyright,
        base_color: res?.data?.data?.base_color,
        company_name: res?.data?.data?.company_name,
        company_email: res?.data?.data?.company_email,
        company_phone: res?.data?.data?.company_phone,
        company_address: res?.data?.data?.company_address,
        company_website: res?.data?.data?.company_website,
      });

      // If settings include logo and favicon, set their previews
      if (res.data.data.logo) setLogoPreview(res.data.data.logo);
      if (res.data.data.favicon) setFaviconPreview(res.data.data.favicon);
    }
  };

  useEffect(() => {
    getSettings();
  }, []);

  useEffect(() => {
    if (values?.base_color) {
      setSelectedColor(values?.base_color)
    }
  }, [values])
  return (
    <form onSubmit={handleFormSubmit}>
      <div className="grid grid-cols-2 gap-4 w-[80%] mx-auto  px-4 py-5 bg-gray-100 shadow-md mt-4 rounded bg-opacity-30">
        <div className="">
          <label className="block mb-2 text-sm text-gray-600">Site Name</label>
          <input
            defaultValue={values.title}
            type="text"
            placeholder="Site name"
            name="title"
            onChange={handleChange}
            className="block w-full px-5 py-2 mt-2 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:outline-none"
          />
        </div>
        <div className="">
          <label className="block mb-2 text-sm text-gray-600">Copyright Text</label>
          <input
            defaultValue={values.copyright}
            type="text"
            placeholder="Copyright text"
            name="copyright"
            onChange={handleChange}
            className="block w-full px-5 py-2 mt-2 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:outline-none"
          />
        </div>
        {/* <div className="">
          <label className="block mb-2 text-sm text-gray-600">Base Color Code</label>
          <input
            defaultValue={values.base_color}
            type='color'
            placeholder="Base Color"
            name="base_color"
            onChange={handleChange}
            className="block w-full px-5 py-2 mt-2 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:outline-none"
          />
        </div> */}

        <div className="">
          <label className="block mb-2 text-sm text-gray-600">Company Name</label>
          <input
            defaultValue={values.company_name}
            type="text"
            placeholder="Company name"
            name="company_name"
            onChange={handleChange}
            className="block w-full px-5 py-2 mt-2 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:outline-none"
          />
        </div>
        <div className="">
          <label className="block mb-2 text-sm text-gray-600">Company Address</label>
          <input
            defaultValue={values.company_address}
            type="text"
            placeholder="Company Address"
            name="company_address"
            onChange={handleChange}
            className="block w-full px-5 py-2 mt-2 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:outline-none"
          />
        </div>
        <div className="">
          <label className="block mb-2 text-sm text-gray-600">Company Website</label>
          <input
            defaultValue={values.company_website}
            type="text"
            placeholder="Site name"
            name="company_website"
            onChange={handleChange}
            className="block w-full px-5 py-2 mt-2 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:outline-none"
          />
        </div>
        <div className="">
          <label className="block mb-2 text-sm text-gray-600">Company Phone</label>
          <input
            defaultValue={values.company_phone}
            type="text"
            placeholder="Company Phone"
            name="company_phone"
            onChange={handleChange}
            className="block w-full px-5 py-2 mt-2 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:outline-none"
          />
        </div>
        <div className="">
          <label className="block mb-2 text-sm text-gray-600">Company Email</label>
          <input
            defaultValue={values.company_email}
            type="text"
            placeholder="Company Email"
            name="company_email"
            onChange={handleChange}
            className="block w-full px-5 py-2 mt-2 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:outline-none"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-2 text-sm font-medium text-gray-700">Select Base Color:</label>
          <div className="relative flex items-center gap-3">
            {/* Color Preview Bar */}


            {/* Color Picker Input */}
            <input
              defaultValue={values.base_color}
              value={selectedColor}
              type="color"
              placeholder="Base Color"
              name="base_color"
              onChange={handleColorChange}
              className="appearance-none cursor-pointer block w-16 h-10 p-0 border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Selected Color Code Output */}
          <p className="mt-2 text-sm text-gray-500">
            Selected Color: <span className="font-medium text-gray-800">{selectedColor}</span>
          </p>
        </div>
        <div className="col-span-2">
          <label className="block mb-2 text-sm text-gray-600">Description</label>
          <textarea
            defaultValue={values.description}
            type="text"
            placeholder="Description"
            name="description"
            onChange={handleChange}
            className="block w-full min-h-[120px] px-5 py-2 mt-2 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:outline-none"
          />
        </div>

        <div className='flex gap-3'>
          <div className="">
            <label className="block mb-2 text-sm text-gray-600">Favicon</label>
            <div
              className="w-[100px] h-[100px] bg-gray-200 shadow-sm border-gray-400  border-dotted border rounded flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={() => faviconInputRef.current.click()}
            >
              {faviconPreview ? (
                <Image
                  width={300}
                  height={300}
                  src={faviconPreview || values.favicon}
                  alt="Favicon Preview"
                  className="w-full h-full"
                />
              ) : (
                <UploaderIcon />
              )}

            </div>
            <input
              ref={faviconInputRef}
              type="file"
              name="favicon"
              onChange={handleFavicon}
              className="hidden"
            />
          </div>

          <div className="">
            <label className="block mb-2 text-sm text-gray-600">Logo</label>
            <div
              className="w-[100px] h-[100px] bg-gray-200 shadow-sm border-gray-400  border-dotted border rounded flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={() => logoInputRef.current.click()}
            >
              {logoPreview ? (
                <Image
                  width={300}
                  height={300}
                  src={logoPreview || values.logo}
                  alt="Logo Preview"
                  className="w-full h-full"
                />
              ) : (
                <UploaderIcon />
              )}

            </div>
            <input
              ref={logoInputRef}
              type="file"
              name="logo"
              onChange={handleLogo}
              className="hidden"
            />
          </div>
        </div>

        <button style={{ background: settings?.base_color }}  type='submit' className={` col-span-2 text-white py-2 text-center w-[170px] ml-auto mt-1.5 rounded`}>
          Submit
        </button>
      </div>
    </form>
  );
};

export default Settings;
