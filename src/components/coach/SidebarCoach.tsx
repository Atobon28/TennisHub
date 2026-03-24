import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";

function SidebarCoach() {
  const menuItems = [
    { to: "/coach/home", label: "Home", icon: "solar:widget-2-outline" },
    { to: "/coach/profile", label: "Profile", icon: "solar:user-linear" },
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
    </div>
  );
}

export default SidebarCoach;
