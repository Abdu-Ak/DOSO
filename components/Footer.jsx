import Logo from "./Logo";
import { getSettings } from "@/lib/settings";

const Footer = async () => {
  const settings = await getSettings();
  const { contact } = settings;

  return (
    <footer
      className="bg-background-dark text-slate-400 py-16 border-t border-slate-800"
      id="contact"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-white mb-2">
              <Logo imgClassName="w-10 h-10" />
              <h3 className="text-xl font-bold">Darul Hidaya Dars</h3>
            </div>
            <p className="text-sm leading-relaxed font-body">
              A center for Islamic excellence, dedicated to nurturing the next
              generation of scholars and leaders through authentic knowledge and
              spiritual growth.
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-3 text-sm font-body">
              <li>
                <a
                  className="hover:text-white transition-colors"
                  href="/alumni"
                >
                  Alumni
                </a>
              </li>
              <li>
                <a
                  className="hover:text-white transition-colors"
                  href="/events"
                >
                  Events
                </a>
              </li>
              <li>
                <a
                  className="hover:text-white transition-colors"
                  href="/contact"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6">Contact Us</h4>
            <ul className="flex flex-col gap-4 text-sm font-body">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">
                  location_on
                </span>
                <span>{contact?.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                  call
                </span>
                <span>{contact?.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                  mail
                </span>
                <span>{contact?.email}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-body">
          <p>
            © {new Date().getFullYear()} Darul Hidaya Dars. All rights reserved.
          </p>
          <p>
            Designed with <span className="text-red-500">♥</span> for the Ummah.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
