import { Link } from 'react-router'; 

const Footer = () => {
  return (
    <div className="relative h-full bg-white text-black">
      <div className="sm:container px-4 py-8 mx-auto">
        <div className="border-b-2 border-black">
          <div className="md:flex justify-between w-full">
            <div>
              <ul>
                <li className="text-2xl pb-2 text-black font-semibold font-main">
                  SITEMAP
                </li>
                <li className="text-xl font-medium font-tertiary">
                  <Link to="/">Home</Link>
                </li>
                <li className="text-xl font-medium font-tertiary">
                  <Link to="/login">Sou ONG</Link>
                </li>
                <li className="text-xl font-medium font-tertiary">
                  <Link to="/">Sobre Nós</Link>
                </li>
              </ul>
            </div>
            <div className="flex gap-10">
              <ul>
                <li className="text-2xl pb-2 text-black font-semibold font-main">
                  SOCIAL
                </li>
                <li className="text-xl font-medium font-tertiary">
                  <Link 
                    to="https://github.com/JoaoPedroOM" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex md:flex-row flex-col-reverse gap-3 justify-between py-2 font-tertiary">
          <span className="font-medium">
            &copy; {new Date().getFullYear()} Adota. All Rights Reserved.
          </span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;