import { hasCookie } from "cookies-next";
import Signup from "../pages/signup";
const withAuth = (Component) => {
  const Auth = (props) => {
    // Login data added to props via redux-store (or use react context for example)
    const isLoggedIn = () => {
      return hasCookie("uid");
    };

    // If user is not logged in, return login component
    if (!isLoggedIn()) {
      return <Signup warning="please login for access this page" />;
    }

    // If user is logged in, return original component
    return <Component {...props} />;
  };

  // Copy getInitial props so it will run as well
  if (Component.getServerSideProps) {
    Auth.getServerSideProps = Component.getServerSideProps;
  }

  return Auth;
};

export default withAuth;
