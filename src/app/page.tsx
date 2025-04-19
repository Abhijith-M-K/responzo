import RequestForm from "./components/requestForm/requestForm";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <RequestForm />
      <Footer />

      
      
    </div>
  );
}
