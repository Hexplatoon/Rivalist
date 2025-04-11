import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-50 text-white p-4 z-50">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold">Your Project Name</h1>
      </div>
    </nav>
  );
};

export default Navbar;