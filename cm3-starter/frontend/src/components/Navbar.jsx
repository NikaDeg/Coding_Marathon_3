import { Link } from "react-router-dom";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const handleClick = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return (
    <nav className="navbar">
      <Link to="/">
        <h1>Vehicle Rental</h1>
      </Link>
      <Link to="/">Home</Link>
      <div className="links">
        {isAuthenticated && (
        <div>
          <Link to="/add-rental">Add  Rental</Link>
          {/* <span>{JSON.parse(localStorage.getItem("user")).name}</span> */}
          <button onClick={handleClick}>Log out</button>
        </div>
        )}
        {!isAuthenticated && (
          <div>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

