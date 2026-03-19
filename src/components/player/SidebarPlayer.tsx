import { NavLink, useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'

function SidebarPlayer() {
  const navigate = useNavigate()

  const menuItems = [
    {
      to: '/player/home',
      label: 'Home',
      icon: 'solar:widget-2-outline',
    },
    {
      to: '/player/tournaments',
      label: 'Tournaments',
      icon: 'solar:ticket-linear',
    },
    {
      to: '/player/courts',
      label: 'Courts',
      icon: 'mdi:tennis-ball-outline',
    },
    {
      to: '/player/notifications',
      label: 'Notifications',
      icon: 'solar:bell-linear',
    },
    {
      to: '/player/profile',
      label: 'Profile',
      icon: 'solar:user-linear',
    },
  ]

  return (
    <div className="player-sidebar">
      <nav className="player-sidebar__nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive
                ? 'player-sidebar__link player-sidebar__link--active'
                : 'player-sidebar__link'
            }
          >
            <Icon icon={item.icon} className="player-sidebar__icon" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="player-sidebar__actions">
        <button
          className="player-sidebar__button player-sidebar__button--primary"
          onClick={() => navigate('/player/create-match')}
        >
          Create Match
        </button>

        <button
          className="player-sidebar__button player-sidebar__button--secondary"
          onClick={() => navigate('/player/coaches')}
        >
          Find a Coach
        </button>
      </div>
    </div>
  )
}

export default SidebarPlayer