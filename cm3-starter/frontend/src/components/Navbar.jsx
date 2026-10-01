import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">
        <h1>Vehicle Rental</h1>
      </Link>
      <div className="links">
        <Link to="/add-rental">Add  Rental</Link>
        <Link to="/">Home</Link>
      </div>
    </nav>
  );
};

export default Navbar;

