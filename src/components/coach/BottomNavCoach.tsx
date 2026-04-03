import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";

function BottomNavCoach() {
  const menuItems = [
    { to: "/coach/home", label: "Home", icon: "solar:widget-2-outline" },
    { to: "/coach/profile", label: "Profile", icon: "solar:user-linear" },
  ];

  return (
    <nav
      className="player-bottomnav"
      style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
    >
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

export default BottomNavCoach;
