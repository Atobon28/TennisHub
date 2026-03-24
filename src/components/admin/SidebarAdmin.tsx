import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";

function SidebarAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const isCourts = location.pathname.includes("/admin/courts");

  const menuItems = [
    { to: "/admin/home", label: "Home", icon: "solar:widget-2-outline" },
    {
      to: "/admin/tournaments",
      label: "My Tournaments",
      icon: "solar:ticket-linear",
    },
    {
      to: "/admin/courts",
      label: "My Courts",
      icon: "mdi:tennis-ball-outline",
    },
    { to: "/admin/profile", label: "Profile", icon: "solar:user-linear" },
  ];

  return (
    <div className="player-sidebar">
      <nav className="player-sidebar__nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive
                ? "player-sidebar__link player-sidebar__link--active"
                : "player-sidebar__link"
            }
          >
            <Icon icon={item.icon} className="player-sidebar__icon" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      {isCourts && (
        <div className="player-sidebar__actions">
          <button
            className="player-sidebar__button player-sidebar__button--primary"
            onClick={() => window.dispatchEvent(new Event("admin:addCourt"))}
          >
            Add Court
          </button>
        </div>
      )}
    </div>
  );
}

export default SidebarAdmin;
