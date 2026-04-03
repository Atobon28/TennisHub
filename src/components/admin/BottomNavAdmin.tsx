import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";

function BottomNavAdmin() {
  const menuItems = [
    { to: "/admin/home", label: "Home", icon: "solar:widget-2-outline" },
    {
      to: "/admin/tournaments",
      label: "Tournaments",
      icon: "solar:ticket-linear",
    },
    { to: "/admin/courts", label: "Courts", icon: "mdi:tennis-ball-outline" },
    { to: "/admin/profile", label: "Profile", icon: "solar:user-linear" },
  ];

  return (
    <nav className="player-bottomnav">
      {menuItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            isActive
              ? "player-bottomnav__link player-bottomnav__link--active"
              : "player-bottomnav__link"
          }
          aria-label={item.label}
        >
          <Icon icon={item.icon} className="player-bottomnav__icon" />
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNavAdmin;
