import Script from "next/script";
import Footer from "./Footer";
import Header from "./Header";
// bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
