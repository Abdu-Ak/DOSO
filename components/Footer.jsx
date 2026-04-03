import Logo from "./Logo";
import { getSettings } from "@/lib/settings";

const Footer = async () => {
  const settings = await getSettings();
  const { contact } = settings;

  return (
    <footer
      className="bg-background-dark text-slate-400 py-10 border-t border-slate-800"
      id="contact"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-white mb-2">
              <Logo imgClassName="w-10 h-10" />
              <h3 className="text-xl font-bold">Darul Hidaya Dars</h3>
            </div>
            <p className="text-sm leading-relaxed font-body max-w-sm">
              A center for Islamic excellence, dedicated to nurturing the next
              generation of scholars and leaders through authentic knowledge and
              spiritual growth.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-10">
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="flex flex-col gap-2.5 text-sm font-body">
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
            <h4 className="text-white font-bold mb-4">Contact Us</h4>
            <ul className="flex flex-col gap-3 text-sm font-body">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5">
                  location_on
                </span>
                <span>{contact?.address || "Loading address..."}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-sm">
                  call
                </span>
                <a
                  href={`tel:${contact?.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {contact?.phone || "Loading phone..."}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-sm">
                  mail
                </span>
                <a
                  href={`mailto:${contact?.email}`}
                  className="hover:text-white transition-colors"
                >
                  {contact?.email || "Loading email..."}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-body uppercase tracking-wider">
          <p className="text-slate-500">
            © {new Date().getFullYear()} Darul Hidaya Dars. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Created by</span>
            <a
              href="https://www.upgrows.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:opacity-80 hover:text-[#d1ff00] text-white transition-opacity"
            >
              <div className="w-5 h-5 bg-[#d1ff00] rounded-sm flex items-center justify-center font-black text-black text-sm leading-none">
                U
              </div>
              <span className="font-bold  tracking-tighter ">UPGROWS</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
