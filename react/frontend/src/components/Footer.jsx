import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

function Footer() {
  return (
    <footer className="bg-white text-gray-700 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold text-blue-700 mb-4">CONTACT INFO</h4>
          <p className="flex items-center mb-2">
            <FaMapMarkerAlt className="mr-2 text-orange-500" />
            CUET, Chittagong, Bangladesh
          </p>
          <p className="flex items-center mb-2">
            <IoMdMail className="mr-2 text-orange-500" />
            info@cuet.ac.bd
          </p>
          <p className="flex items-center">
            <FaPhoneAlt className="mr-2 text-orange-500" />
            +880 1234-567890
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="text-lg font-semibold text-blue-700 mb-4">COMPANY</h4>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-orange-500">Home</a></li>
            <li><a href="/" className="hover:text-orange-500">About Us</a></li>
            <li><a href="/" className="hover:text-orange-500">Work with Us</a></li>
            <li><a href="/" className="hover:text-orange-500">Our Services</a></li>
            <li><a href="/" className="hover:text-orange-500">Terms and Conditions</a></li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h4 className="text-lg font-semibold text-blue-700 mb-4">USEFUL LINKS</h4>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-orange-500">Help Center</a></li>
            <li><a href="/" className="hover:text-orange-500">Track Order</a></li>
            <li><a href="/" className="hover:text-orange-500">Privacy Policy</a></li>
            <li><a href="/" className="hover:text-orange-500">Return Policy</a></li>
            <li><a href="/" className="hover:text-orange-500">Shipping Policy</a></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="text-lg font-semibold text-blue-700 mb-4">FOLLOW US</h4>
          <div className="flex space-x-4">
            <a href="/" className="hover:text-orange-500 transition-colors"><FaFacebookF /></a>
            <a href="/" className="hover:text-orange-500 transition-colors"><FaTwitter /></a>
            <a href="/" className="hover:text-orange-500 transition-colors"><FaInstagram /></a>
            <a href="/" className="hover:text-orange-500 transition-colors"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} CUET. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
