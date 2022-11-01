import Script from "next/script";
import Footer from "./Footer";
import Header from "./Header";
// bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main>
        <div className="container">
          <div className="row">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
